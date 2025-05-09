import clientPromise from "@/lib/mongodb";

export default async function createLogs(user, type, data) {
    if (!user || !type || !data) {
        console.warn("createLogs: Faltan datos requeridos");
        return false;
    }

    const client = await clientPromise;
    const db = client.db("proyecto_educa");
    const collection = db.collection("logs");

    let updateField;

    switch (type) {
        case "createCourse":
            updateField = { logs_createCourse: data };
            break;
        case "dubbing":
            updateField = { logs_dubbing: data };
            break;
        case "voices":
            updateField = { logs_voices: data };
            break;
        case "authorized_user":
            updateField = { logs_authorizedUser: data };
            break;
        case "convert_file":
            updateField = { logs_convertFile: data };
            break;
        case "text_to_speech":
            updateField = { logs_textToSpeech: data };
            break;
        default:
            console.warn(`createLogs: Tipo de log no válido: ${type}`);
            return false;
    }

    try {
        const result = await collection.updateOne(
            { user },
            { $push: updateField },
            { upsert: true }
        );


        return result.acknowledged === true;
    } catch (error) {
        console.error("createLogs: Error al guardar log:", error);
        return false;
    }
}
