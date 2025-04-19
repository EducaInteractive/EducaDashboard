import { prompCreateClass } from "@/contans";
import OpenAI from "openai";
import clientPromise from "@/lib/mongodb";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function createClasses(req, res) {
    if (req.method === "POST") {
        try {
            const { classNumber, schema, email } = req.body

            if (!classNumber || !schema || !email) {
                return res.status(400).json({ error: "Faltan datos en la solicitud" });
            }

            const prompt1 = prompCreateClass

            const prompt = `Esta en la clase que debes crear: ${classNumber} y en base a este esquema: ${schema}`

            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                        {
                            role: "system",
                            content: prompt1
                        }
                    ],
                    response_format: { type: "json_object" },
                    max_tokens: 2000,
                });


                const chatResponse = response.choices[0].message.content;
                const chatResponseJson = JSON.parse(chatResponse);
                if (chatResponseJson.title && chatResponseJson.introduction && chatResponseJson.development && chatResponseJson.conclusion && chatResponseJson.activity) {
                    res.status(200).json({ ClassData: chatResponseJson });
                    return await saveData(email, chatResponseJson, classNumber);
                } else {
                    return res.status(404).json({ message: " Error en la respuesta de OpenAI" });
                }
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


async function saveData(email, contentClass, numberClass) {
    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collect = db.collection("classes");

    const { title, introduction, development, conclusion, activity } = contentClass;

    const dateNow = () => { return new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }); }
    const newClass = {
        numberClass,
        title,
        introduction,
        development,
        conclusion,
        activity,
        numberRenegerate: 0,
        lastUpdated: dateNow()
    };

    const updateResult = await collect.updateOne(
        {
            email,
            "classes.numberClass": numberClass
        },
        {
            $set: {
                "classes.$.title": title,
                "classes.$.introduction": introduction,
                "classes.$.development": development,
                "classes.$.conclusion": conclusion,
                "classes.$.activity": activity,
                "classes.$.lastUpdated": dateNow()
            },
            $inc: {
                "classes.$.numberRenegerate": 1
            }
        }
    );

    if (updateResult.matchedCount === 0) {
        await collect.updateOne(
            { email },
            {
                $setOnInsert: { email },
                $push: { classes: newClass }
            },
            { upsert: true }
        );
    }
}



