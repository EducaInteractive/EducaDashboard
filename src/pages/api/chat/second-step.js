import OpenAI from "openai";
import clientPromise from "@/lib/mongodb";
import { promtGeneral } from "@/contans";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function SecondStep(req, res) {
    if (req.method === "POST") {

        try {

            const { email, knowledge, people } = req.body

            if (!email || !knowledge || !people) {
                res.status(400).json({ error: "Faltan datos" });
                return;
            }
            const schemaSave = await findSchema(email);

            const prompt = `El instructor desea incluir los siguientes contenidos particulares:"${knowledge}" Además, el público objetivo es:"${people}" Por favor, ajusta el borrador del esquema que me diste antes para integrar estos contenidos particulares y adecuarlo al nivel de este público. Asegúrate de: - Respetar la secuencia de 4 clases. - Incluir ejemplos o aplicaciones relacionadas con las experiencias del instructor. - Adaptar la complejidad del contenido al público descrito. Aqui esta el esquema anterior: ${schemaSave}`
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

                await saveData(email, knowledge, people, schema);

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

async function saveData(email, knowledge, people, schema) {
    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collect = db.collection("course");

    await collect.updateOne(
        { email },
        { $set: { schema, knowledge, people } }
    );


}

async function findSchema(email) {
    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collect = db.collection("course");
    
    const res=await collect.findOne({ email });
    if(res){
        return res.schema;
    }
    return null;

}
