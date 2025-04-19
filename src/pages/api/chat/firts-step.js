import OpenAI from "openai";
import clientPromise from "@/lib/mongodb";
import { promtGeneral } from "@/contans";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function firtStep(req, res) {
    if (req.method === "POST") {

        try {

            const { email, tema, content } = req.body

            if (!email || !tema) {
                res.status(400).json({ error: "Faltan datos" });
                return;
            }
            await findData(email);

            const contentPrinc = content || "Sin temas principales";

            const prompt = `Tengo la siguiente información inicial:- Título del curso: "${tema}"- Temas principales: "${contentPrinc}"Por favor, crea un primer borrador del esquema de 4 clases para este curso, teniendo en cuenta el nivel básico y aplicando el Análisis del Contexto. No incluyas aún detalles de experiencias personales ni referencias; solo enfócate en la estructura básica y la secuencia lógica de los temas.`
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: promtGeneral
                        },
                        {
                            role: "user",
                            content: prompt
                        },

                    ],
                });

                const schema = response.choices[0].message.content || " ";

                await saveData(email, tema, contentPrinc, schema);

                res.status(200).json({ message: "Datos guardados" });
            } catch (error) {
                console.error("Error al crear el chat:", error);
                res.status(500).json({ error: "Error en el servidor" });
            }

        } catch (error) {
            console.error("Error en el chat:", error);
            res.status(500).json({ error: "Error Interno del Servidor" });
        }
    } else {
        res.status(405).json({ error: "Método No Permitido" });
    }
}

async function saveData(email, tema, content, schema) {
    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collect = db.collection("course");

    const existingDoc = await collect.findOne({ email });

    if (existingDoc) {
        await collect.updateOne(
            { email },
            { $set: { tema, content, schema } }
        );
    } else {
        const object = { email, tema, content, schema };
        await collect.insertOne(object);
    }
}

async function findData(email) {
    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collect = db.collection("course");
    
    const res=await collect.findOne({ email });
    if(res){
       await collect.deleteOne({email});
    }
    return;
}
