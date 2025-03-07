import { ElevenLabsClient } from 'elevenlabs';
import clientPromise from "@/lib/mongodb";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LAB_API_KEY });

export default async function handler(req, res) {
    try {
        const clientMongo = await clientPromise;
        const db = clientMongo.db("proyecto_educa");
        const collect = db.collection("dubbing");

        if (req.method === "GET") {
            const { idVideo } = req.query;
            if (!idVideo) return res.status(400).json({ error: "Faltan datos" });

            try {
                const getVideoDubbed = await client.dubbing.getDubbingProjectMetadata(idVideo);
                if (!getVideoDubbed) {
                    return res.status(404).json({ error: "No se encontró el proyecto" });
                }
                const findDubbing = await collect.findOne({idVideo});
                if(findDubbing ){
                    if(findDubbing.status!=="dubbed"){
                        await collect.updateOne({idVideo},{$set:{status:getVideoDubbed.status}})
                    }
                }
                return res.status(200).json({ status: getVideoDubbed.status });
            } catch (error) {
                console.error("Error verificando el video:", error);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        }
    } catch (error) {
        console.error("error al conectar en la base de datos")
    }
}