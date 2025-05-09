import OpenAI from "openai";
import { promtGeneral } from "@/contans";
import clientPromise from "@/lib/mongodb";
import createLogs from "../logs/allLogs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function schema(req, res) {
    if (req.method === "POST") {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        try {
            const { email, tema, knowledge,people } = req.body;
            if (!email || !tema || !knowledge||!people) {
                res.status(400).json({ error: "Faltan datos" });
                return;
            }

            //const schemaSave = await findSchema(email);

            const prompt = `aqui estan los datos del curso:
            Título del curso: ${tema}, Contenidos particulares: ${knowledge}, personas a las que va dirigido: ${people}.`;

            try {
                const stream = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "user", content: prompt },
                        { role: "system", content: promtGeneral }
                    ],
                    stream: true,
                });

                let generatedSchema = ""; 

                for await (const chunk of stream) {
                    const text = chunk.choices[0].delta.content ?? "";
                    generatedSchema += text;
                    res.write(text);
                    if (res.flush) {
                        res.flush();
                    }
                }

                res.write("\n\n");
                await createLogs(email, 'createCourse', {
                    tema: tema,
                    knowledge: knowledge,
                    people: people,
                    schema: generatedSchema,
                    date: new Date().toISOString()
                  });
                await saveData(email, tema, knowledge,people, generatedSchema);

                res.end();
                return;
            } catch (error) {
                console.error("Error al crear el chat:", error);
                res.status(500).json({ error: "Error con el servidor de OpenAI" });
            }

        } catch (error) {
            console.error("Error en el chat:", error);
            res.status(500).json({ error: "Error Interno del Servidor" });
        }
    } else {
        res.status(405).json({ error: "Método No Permitido" });
    }
}

async function saveData(email, tema, knowledge, people, schema) {
    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collect = db.collection("course");

    await collect.updateOne(
        { email }, 
        { $set: { schema, tema, knowledge, people,count_regenerate:0 } }, 
        { upsert: true } // Crea el documento si no existe
    );
}


async function findSchema(email) {
    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collect = db.collection("course");

    const res = await collect.findOne({ email });
    return res ? res.schema : null;
}
