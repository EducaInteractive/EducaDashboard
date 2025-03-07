import { ElevenLabsClient } from "elevenlabs";
import clientPromise from "@/lib/mongodb";
const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LAB_API_KEY });


export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { idVideo } = req.query;
        if (!idVideo) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        try {
            const getVideoDubbed = await client.dubbing.getDubbingProjectMetadata(idVideo);
            if (!getVideoDubbed) {
                res.status(404).json({ error: "No se encontró el proyecto" });
                return;
            }

            if (getVideoDubbed.status !== "dubbed") {
                res.status(402).json({ message: "El video no se ha terminado de doblar" });
                return;
            }

            const videoStream = await client.dubbing.getDubbedFile(
                getVideoDubbed.dubbing_id,
                getVideoDubbed.target_languages[0]
            );

            // Configuración de headers
            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Accept-Ranges", "bytes");

            await new Promise((resolve, reject) => {
                videoStream.pipe(res)
                    .on('finish', () => {
                        resolve();
                    })
                    .on('error', (error) => {
                        console.error('Error en el stream:', error);
                        reject(error);
                    });

                videoStream.on('error', (error) => {
                    console.error('Error en el stream de entrada:', error);
                    reject(error);
                });
            });

        } catch (error) {
            console.error("Error obteniendo el video doblado:", error);
            if (!res.headersSent) {
                res.status(500).json({ error: "Error interno del servidor" });
            }
        }
    }
    else if (req.method === "DELETE") {
        try {
            const clientMongo = await clientPromise;
            const db = clientMongo.db("proyecto_educa");
            const collect = db.collection("dubbing");


            const { idVideo } = req.query;
            if (!idVideo) return res.status(400).json({ error: "falta id" });

            await client.dubbing.deleteDubbingProject(idVideo);

            const deleteDubbing = await collect.deleteOne({ idVideo: idVideo });
            if (deleteDubbing.deletedCount) return res.status(200).json({ message: "dubbing eliminado con exito" });

            return res.status(400).json({ error: "no se encontro un dubbing con ese id" })

        } catch (error) {
            console.error("Error borrando el video:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
