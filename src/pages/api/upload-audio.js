import { IncomingForm } from "formidable";
import { ElevenLabsClient } from "elevenlabs";
import clientPromise from "@/lib/mongodb";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LAB_API_KEY,
  timeout: 120000,
});

const clientMongo=await clientPromise;
const db = clientMongo.db("proyecto_educa");
const collect = db.collection("voices");

export default async function uploadAudio(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const timeout = setTimeout(() => {
    res.status(504).json({ error: "Tiempo de espera agotado" });
  }, 300000);

  const form = new IncomingForm({
    keepExtensions: true,
    uploadDir: "./tmp",
    maxFileSize: 10 * 1024 * 1024,
  });

  let currentFile = null;

  try {

    const processForm = () => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ fields, files });
        });
      });
    };

    const { fields, files } = await processForm();

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    currentFile = file; 

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;

    const noise = fields.noise == "true"

    const description = Array.isArray(fields.description) ? fields.description[0] : " ";

    const amountMaxVoices = Array.isArray(fields.amountMaxVoices) ? fields.amountMaxVoices[0] : 0;

    const amountVoicesClo = Array.isArray(fields.amountVoicesClo) ? fields.amountVoicesClo[0] : 0;

    const email = Array.isArray(fields.email) ? fields.email[0] : "";

    if(amountVoicesClo==amountMaxVoices){
      throw new Error("Limite de clonacion alcanzado");
    }

    if (!file || !file.filepath || !name) {
      throw new Error("Campos inválidos");
    }

    if (!fs.existsSync(file.filepath)) {
      throw new Error("Archivo no encontrado");
    }

    const stats = fs.statSync(file.filepath);
    if (stats.size > 25 * 1024 * 1024) {
      throw new Error("Archivo demasiado grande");
    }

    const response = await client.voices.add({
      files: [fs.createReadStream(file.filepath)],
      name: name,
      remove_background_noise:noise,
      description:description

    });

    if (file.filepath && fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }

    const existingDocument = await collect.findOne({ email:email });
    const datenow=new Date();

    if (existingDocument) {
      const existingVoice = existingDocument.voices.find(voice => voice.id === response.voice_id);
      if (!existingVoice) {
        existingDocument.voices.push({id:response.voice_id,name:name,date:datenow});
        await collect.updateOne({ _id: existingDocument._id }, { $set: existingDocument });
      }
    }else{
      const newDocument = { email: email, voices: [{id:response.voice_id,name:name,date:datenow}] };
      await collect.insertOne(newDocument);
    }


    clearTimeout(timeout);
    return res.status(200).json({
      message: "Voz subida con éxito",
      data: response,
    });

  } catch (error) {
    console.error("Error detallado:", error);

    if (currentFile?.filepath && fs.existsSync(currentFile.filepath)) {
      try {
        fs.unlinkSync(currentFile.filepath);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo temporal:", unlinkError);
      }
    }

    clearTimeout(timeout);
    return res.status(500).json({
      error: "Error al procesar la solicitud",
      details: error.message,
    });
  }
}