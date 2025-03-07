import clientPromise from "@/lib/mongodb";


export default async function chat(req, res) {
    try {

        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const collect = db.collection("chats-conversations");
        if (req.method === "POST") {

            try {
                const { threadId, messages, email } = req.body;

                if (!threadId || !messages) return res.status(400).json({ error: "Faltan datos" });

                const existingDoc = await collect.findOne({ threadId });

                if (existingDoc) {

                    await collect.updateOne(
                        { threadId },
                        { $set: { messages } }
                    );
                    return res.status(200).json({ message: "Datos actualizados" });
                } else {

                    const object = { threadId, messages, email };
                    await collect.insertOne(object);
                    return res.status(200).json({ message: "Datos guardados" });
                }
            } catch (error) {
                console.log("error en el servidor");
            }


        }
        else if (req.method === "GET") {
            const { email } = req.query;
            if (!email) return res.status(400).json({ error: "falta email" });

            const data = await collect
                .find({ email })
                .toArray();

            return res.status(200).json({ messagesSave: data|| [] })
        }

    } catch (error) {
        console.log("error en la coneccion con la base de datos");
    }

}
