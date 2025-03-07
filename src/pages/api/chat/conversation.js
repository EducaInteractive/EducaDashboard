import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function conversation(req, res) {
    if (req.method === "POST") {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let prompt;
        try {
            const { tema, content, knowledge,contentInput,threadId } = req.body
            if (!threadId) {
                prompt = `Tienes que ayudarme a crear un curso con la siguiente informacion el tema del curso es: ${tema} el contenido del curso sera: ${content} ademas mis conocimientos empiricos son: ${knowledge} y esta es mi idea para el curso: ${contentInput}`
            }
            else { prompt = req.body.contentInput }


            const messagesConv = { role: "user", content: prompt };

            const assistant = await openai.beta.assistants.retrieve(process.env.ASSISTANT_ID);
            let thread;

            if (threadId) {
                try {
                    thread = await openai.beta.threads.retrieve(threadId);
                } catch (error) {
                    console.error("Error al recuperar el hilo existente:", error);
                    thread = await openai.beta.threads.create();
                }
            } else {
                thread = await openai.beta.threads.create();
            }

            if (!threadId) {
                res.setHeader("X-Thread-Id", thread.id)
            }


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
            console.error("Error en el chat:", error);
            res.status(500).json({ error: "Error Interno del Servidor" });
        }
    } else {
        res.status(405).json({ error: "Método No Permitido" });
    }
}
