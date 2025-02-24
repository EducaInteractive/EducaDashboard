import { useState, useEffect } from "react";
import { Upload, CheckCircle, X } from "lucide-react";
import notyf from "@/utils/notificacion";
import { useDisabled } from "@/contexts/DisabledContext";

function ConvertFile() {
    const { setDisabled } = useDisabled();
    const [audioFile, setAudioFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [url, setUrl] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile) return notyf.error("Cargue un archivo");
        setIsSubmitting(true);
        setDisabled(true);

        const formData = new FormData();
        formData.append("file", audioFile);
        try {
            const res = await fetch("/api/convert-file", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setUrl(data.url);
                setIsSuccess(true);
            }
        } catch (error) {
            notyf.error("Hubo un error al convertir el archivo");
        }

        setIsSubmitting(false);
        setDisabled(false);
    };

    useEffect(() => {
        if (isSuccess) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [isSuccess]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg","video/mp4"];
            if (!validAudioTypes.includes(file.type)) {
                notyf.error("Por favor, sube un archivo de audio válido (OGG, WAV, MPGE, O MP4).");
                setAudioFile(null);
                return;
            }

            const maxSizeInBytes = 25 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                notyf.error(
                    "El archivo es demasiado grande. El tamaño máximo permitido es de 25MB."
                );
                setAudioFile(null);
                return;
            }
            setAudioFile(file);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Convierte tu archivo a MP3
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Convierte tu archivo de audio a formato MP3 de forma sencilla.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white p-8 rounded-xl shadow-sm"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Archivo de audio *
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="audio-file"
                                        className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500"
                                    >
                                        <span>Click aquí para subir un archivo</span>
                                        <input
                                            id="audio-file"
                                            type="file"
                                            accept="audio/ogg, audio/wav, audio/mpeg, video/mp4"
                                            required
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">OGG, WAV, MPGE, O MP4 hasta 25MB</p>
                            </div>
                        </div>
                        {audioFile && (
                            <div className="mt-2 flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                {audioFile.name}
                                <button
                                    type="button"
                                    onClick={() => setAudioFile(null)}
                                    className="ml-2 text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${isSubmitting
                                ? "bg-purple-400"
                                : "bg-purple-600 hover:bg-purple-700"
                            } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                    >
                        {isSubmitting ? "Procesando..." : "Subir y convertir"}
                    </button>
                </form>

                {isSuccess && url && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                        <div className="flex flex-col items-center space-y-3">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                            <h3 className="text-sm font-medium text-green-800">
                                ¡Archivo convertido con éxito!
                            </h3>
                            <p className="text-sm text-green-700">
                                Haz clic en el botón para descargar tu MP3.
                            </p>
                            <a
                                href={url}
                                download
                                target="_blank"
                                className="inline-block py-2 px-6 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                            >
                                Descargar MP3
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConvertFile;
