import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function schema(req, res) {
    if (req.method === "POST") {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        try {
            const { tema, content, knowledge } = req.body

            const prompt = `# Objetivo: Eres un experto en diseño de programas educativos innovadores para cursos online. Tu misión es desarrollar un esquema estructurado para un curso online de nivel básico, compuesto por 4 módulos, cada uno con 4 clases.
Este esquema debe basarse en la información proporcionada por el instructor, que incluye:
Título del curso: Representa el tema principal sobre el cual el instructor desea enseñar.
Temas principales: Son los contenidos centrales que el instructor considera esenciales para el curso.
Contenidos particulares: Incluyen conocimientos empíricos, experiencias, enfoques específicos o perspectivas propias que el instructor desea integrar en el curso.
# Lógica: Aplica la siguiente lógica para crear el esquema:
Análisis del Contexto:
Define la estructura del curso basándote en estándares de calidad y en modelos de cursos básicos exitosos dentro de la misma área temática.
Considera la mejor secuencia de aprendizaje para un estudiante principiante.
Interpretación del Enfoque del Instructor:
Analiza los temas principales y los contenidos particulares proporcionados.
Identifica el enfoque que el instructor quiere dar a su curso.
Ajuste y Optimización:
Diseña un esquema inicial con una distribución lógica de los módulos y clases.
Incorpora los contenidos específicos solicitados por el instructor.
Añade temas complementarios que, aunque no hayan sido mencionados, sean relevantes para reforzar el enfoque, o para completar y enriquecer el contenido.
# Reglas y Formato:
El esquema debe seguir la estructura fija de 4 módulos, con 4 clases en cada módulo.
La progresión de los contenidos debe ser clara y adecuada para un nivel básico.
La organización debe garantizar una curva de aprendizaje fluida y coherente. aqui estan el contenido del curso
Título del curso: ${tema} Temas principales: ${content} Contenidos particulares: ${knowledge}`

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
