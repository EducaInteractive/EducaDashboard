import { IncomingForm } from "formidable";
import fs from "fs";
import Cloudconvert from "cloudconvert";
import createLogs from "./logs/allLogs";

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },
};

const cloudConvert = new Cloudconvert(process.env.CLOUDCONVERT_API_KEY)

export default async function convertFile(req, res) {
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
        const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
        currentFile = file;


        if (!file || !file.filepath) {
            throw new Error("Campos inválidos");
        }

        if (!fs.existsSync(file.filepath)) {
            throw new Error("Archivo no encontrado");
        }

        const stats = fs.statSync(file.filepath);
        if (stats.size > 25 * 1024 * 1024) {
            throw new Error("Archivo demasiado grande");
        }

        try {
            const job = await cloudConvert.jobs.create({
                tasks: {
                    "import-file": {
                        operation: "import/upload",
                    },
                    "convert-file": {
                        operation: "convert",
                        input: "import-file",
                        output_format: "mp3",
                    },
                    "export-file": {
                        operation: "export/url",
                        input: "convert-file",
                    },
                },
            });


            const importTask = job.tasks.find((task) => task.name === "import-file");

            await cloudConvert.tasks.upload(
                importTask,
                fs.createReadStream(file.filepath),
                file.name
            );

            const completedJob = await cloudConvert.jobs.wait(job.id);

            const exportTask = completedJob.tasks.find(
                (task) => task.name === "export-file"
            );

            const fileUrl = exportTask.result.files[0].url;

            fs.unlinkSync(file.filepath);

            await createLogs(email, 'convert_file', {
                email,
                file: fileUrl,
                date: new Date().toISOString(),
            });

            clearTimeout(timeout);
            return res.status(200).json({
                message: "Archivo convertido con exito",
                url: fileUrl,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al convertir el archivo" })
        }

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