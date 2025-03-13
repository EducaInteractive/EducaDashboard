import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function schema(req, res) {
    if (req.method === "POST") {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        try {
            const { tema, content, knowledge,people } = req.body

            const prompt = `aqui estan los datos del curso:
            Título del curso: ${tema}, Temas principales: ${content}, Contenidos particulares: ${knowledge}, personas a las que va dirigido: ${people}`;

            const messagesConv = { role: "user", content: prompt };

            try {
                const assistant = await openai.beta.assistants.retrieve(process.env.ASSISTANT_ID);
                const thread = await openai.beta.threads.create();
                await openai.beta.threads.messages.create(thread.id, messagesConv);

                const stream = openai.beta.threads.runs.stream(thread.id, {
                    assistant_id: assistant.id,
                    stream: true,
                });
    
                for await (const event of stream) {
                    if (event.event === 'thread.message.delta') {
                        const chunk = event.data.delta.content?.[0];
                        if (chunk && chunk.type === 'text') {
                            res.write(chunk.text?.value ?? '');
                            if (res.flush) {
                                res.flush();
                            }
                        }
                    }
                }
    
                res.write("\n\n");
                res.end();
            } catch (error) {
                console.error("Error al crear el chat:", error);
                res.status(500).json({ error: "Error con el servidor de openai" });
            }
      
        } catch (error) {
            console.error("Error en el chat:", error);
            res.status(500).json({ error: "Error Interno del Servidor" });
        }
    } else {
        res.status(405).json({ error: "Método No Permitido" });
    }
}
