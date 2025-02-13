import clientPromise from "@/lib/mongodb";
import { ElevenLabsClient } from "elevenlabs";

const clientElev = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LAB_API_KEY })
export default async function searchVoicesClo(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const collect = db.collection("voices");

        if (req.method === "GET") {
            try {
                const { email } = req.query;
                if (!email) return res.status(400).json({ error: "Faltan datos" });

                const findVoices = await collect.findOne({ email });

                if (!findVoices) {
                    return res.status(200).json({ amountVoicesClon: 0 });
                }

                const amountVoices = findVoices.voices || [];
                return res.status(200).json({ amountVoicesClon: amountVoices.length });
            } catch (error) {
                console.error("Error en searchVoicesClo:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
        }
        else if (req.method === "DELETE") {
            try {
                const { voiceId } = req.query;
                if (!voiceId) return res.status(400).json({ error: "Faltan datos" });

                const deleteVoiceElevLabs = await clientElev.voices.delete(voiceId);
                const deleteVoice = await collect.updateOne(
                    { "voices.id": voiceId },
                    { $pull: { voices: { id: voiceId } } }
                );

                if (deleteVoice.modifiedCount === 0) {
                    return res.status(404).json({ error: "Elemento no encontrado" });
                }

                return res.status(200).json({ message: "Elemento eliminado correctamente" });


            } catch (error) {
                console.error("Error al borrar voz:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
        }

    } catch (error) {
        console.log("error al conectar en la base de datos")
    }




}
