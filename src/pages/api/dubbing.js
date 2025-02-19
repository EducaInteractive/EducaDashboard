import { IncomingForm } from 'formidable';
import fs from 'fs';
import { ElevenLabsClient } from 'elevenlabs';
import clientPromise from '@/lib/mongodb';
export const config = {
    api: {
        bodyParser: false,
    },
};

const form = new IncomingForm({
    keepExtensions: true,
    uploadDir: "./tmp",
    maxFileSize: 50 * 1024 * 1024,
});



export default async function dubbing(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }

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

        let videoUrl, sourceLang, targetLang, numSpeakers, name,email;
        let fileUploaded = null;

        if (req.headers['content-type']?.includes('multipart/form-data')) {
            const { fields, files } = await processForm();
            fileUploaded = Array.isArray(files.videoFile) ? files.videoFile[0] : files.videoFile;
            sourceLang = Array.isArray(fields.videoFile) ? fields.sourceLang[0] : 'auto';
            targetLang = Array.isArray(fields.targetLang) ? fields.targetLang[0] : fields.targetLang;
            numSpeakers = Array.isArray(fields.numSpeakers) ? fields.numSpeakers[0] : 1;
            name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
        } else {
            const body = await new Promise((resolve, reject) => {
                let data = '';
                req.on('data', chunk => data += chunk);
                req.on('end', () => resolve(JSON.parse(data)));
                req.on('error', reject);
            });
            name = body.name;
            email = body.email;
            videoUrl = body.videoUrl;
            sourceLang = body.sourceLang || 'auto';
            targetLang = body.targetLang;
            numSpeakers = body.numSpeakers || 1;
        }
        const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LAB_API_KEY });

        let result;

        if (fileUploaded) {
            const filePath = fileUploaded.filepath;
            const fileBuffer = fs.readFileSync(filePath);
            const fileBlob = new Blob([fileBuffer], { type: fileUploaded.mimetype || 'video/mp4' });

            result = await client.dubbing.dubAVideoOrAnAudioFile({
                name: name,
                file:fileBlob,
                source_lang: sourceLang,
                target_lang: targetLang,
                num_speakers: parseInt(numSpeakers),
                watermark: true,
            });

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }

        } else if (videoUrl) {
            result = await client.dubbing.dubAVideoOrAnAudioFile({
                name: name,
                source_url: videoUrl,
                source_lang: sourceLang,
                target_lang: targetLang,
                num_speakers: parseInt(numSpeakers),
                watermark: true,
            });
        } else {
            return res.status(400).json({ error: 'Debe enviar una URL o un archivo de video.' });
        }

        const clientMongo=await clientPromise;
        const db = clientMongo.db("proyecto_educa");
        const collect = db.collection("dubbing");
        const videoDubbed={idVideo:result.dubbing_id,name:name,targetLang:targetLang,email:email,status:"creating"};
        await collect.insertOne(videoDubbed);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error en el proceso de doblaje:', error);
        return res.status(500).json({ error: error.message || 'Error interno en el servidor' });
    }
}
