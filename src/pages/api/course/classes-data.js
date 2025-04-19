import clientPromise from "@/lib/mongodb";

export default async function classesData(req, res) {

    try {
        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const collect = db.collection("classes");
        const collectCourse = db.collection("course");
        if (req.method === "GET") {
            try {
                const { email } = req.query;
                if (!email) return res.status(400).json({ error: "falta email" });

                const data = await collect.findOne({ email });
                const dataCourse = await collectCourse.findOne({ email });

                return res.status(200).json({ classesData: data || [], courseData: dataCourse || {} })


            } catch (error) {
                return res.status(500).json({ error: "error en el servidor" })
            }
        }
        else if (req.method === "PUT") {
            try {
                const { email, numberClass, title, introduction, development, conclusion, activity } = req.body;

                if (!email || !numberClass) return res.status(400).json({ error: "falta email" });
                
                const dateNow = () => {
                     return new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }); 
                    }

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
                        }
                    }
                );

                if (updateResult.matchedCount > 0) return res.status(200).json({ message: "Clase actualizada correctamente" });

                else return res.status(404).json({ error: "Clase no encontrada" });


            } catch (error) {
                return res.status(500).json({ error: "error en el servidor" })
            }
        }

    } catch (error) {
        return res.status(500).json({ error: "error al conectar con la base de datos" })
    }

}