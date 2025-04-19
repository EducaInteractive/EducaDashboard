import clientPromise from "@/lib/mongodb";

export default async function courseData(req, res) {

    try {
        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const collect = db.collection("course");

       {/* if (req.method === "POST") {
            try {
                const { email, tema, content, knowledge, people, bibliografy, studies } = req.body;
                if (!email || !tema || !knowledge || !people || !bibliografy || !studies) return res.status(400).json({ error: "Faltan datos" });

                const existingDoc = await collect.findOne({ email });

                const contentSave = content || "Sin informacion"

                if (existingDoc) {

                    await collect.updateOne(
                        { email },
                        { $set: { tema, content: contentSave, knowledge, people, bibliografy, studies } }
                    );
                    return res.status(200).json({ message: "Datos actualizados" });
                } else {

                    const object = { email, tema, contentSave, knowledge, people, bibliografy, studies };
                    await collect.insertOne(object);
                    return res.status(200).json({ message: "Datos guardados" });
                }

            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Error en el servidor" });
            }
        }
            */}
         if (req.method === "PUT") {
            try {
                const { email, schema } = req.body;
                console.log(email, schema)
                if (!email || !schema) return res.status(400).json({ error: "faltan datos" });

                await collect.updateOne(
                    { email },
                    { $set: { schema } }
                );

                return res.status(200).json({ message: "Esquema guardado" });

            } catch (error) {
                return res.status(500).json({ error: "error en el servidor" })
            }
        }
        else if (req.method === "GET") {
            try {
                const { email } = req.query;
                if (!email) return res.status(400).json({ error: "falta email" });

                const data = await collect.findOne({ email });

                if (data) return res.status(200).json({ courseData: data})

                return res.status(404).json({ courseData: {}, messsage: "No se encontraron datos" })

            } catch (error) {
                return res.status(500).json({ error: "error en el servidor" })
            }
        }

    } catch (error) {
        return res.status(500).json({ error: "error al conectar con la base de datos" })
    }

}