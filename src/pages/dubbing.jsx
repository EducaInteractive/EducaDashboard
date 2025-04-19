import { useState } from "react";
import { Upload } from "lucide-react";
import notyf from "@/utils/notificacion";
import { CheckCircle, X } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import VideosDubbed from '@/components/dubbing/VideosDubbed';
import { getSession } from "next-auth/react";
import { useDisabled } from "@/contexts/DisabledContext";
import { languagesSources, languagesTarget } from "@/contans";
import { submitDubbingRequest } from "services/dubbing";


export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {
            props: {
                videosDubbedArray: []
            },
        };
    }
    if (session.user && session.user.email) {

        const videosDubbedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dubbing/get-videos-dubbed?email=${session.user.email}`);
        const videosDubbedData = await videosDubbedRes.json();

        return {
            props: {
                videosDubbedArray: videosDubbedData.videosDubbed || [],
            },
        };
    }

    return {
        props: {
            videosDubbedArray: []
        },
    };

}



function dubbing({ videosDubbedArray }) {

    const { setDisabled } = useDisabled();
    const [localVideosDubbed, setLocalVideosDubbed] = useState(videosDubbedArray);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [typeVideo, setTypeVideo] = useState('')
    const [videoFile, setVideoFile] = useState(null)
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [numSpeakers, setNumSpeakers] = useState('1')
    const [languageSource, setLanguageSource] = useState('en')
    const [languagetarget, setLanguageTarget] = useState('en')

    const { data: session } = useSession()



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
            const validVideoTypes = ["video/mp4", "video/quicktime"];

            if (!validVideoTypes.includes(file.type)) {
                notyf.error("Por favor, sube un archivo de video válido (MP4 o MOV).");
                setVideoFile(null);
                return;
            }

            const maxSizeInBytes = 50 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                notyf.error("El archivo es demasiado grande. El tamaño máximo permitido es de 10MB.");
                setVideoFile(null);
                return;
            }
            setVideoFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !typeVideo || !languagetarget || !numSpeakers.trim()) {
            return notyf.error("Complete los campos");
        }

        setDisabled(true);
        setIsSubmitting(true);

        const dubbingData = {
            name,
            email: session.user.email,
            sourceLang: languageSource,
            targetLang: languagetarget,
            numSpeakers,
            videoFile: typeVideo === 'file' ? videoFile : null,
            videoUrl: typeVideo === 'url' ? url : null
        };

        const result = await submitDubbingRequest(dubbingData);

        if (result.success) {
            setLocalVideosDubbed(prev => [
                ...(prev || []),
                {
                    idVideo: result.dubbing_id,
                    name: name,
                    targetLang: languagetarget,
                    status: "dubbing",
                }
            ]);

            setIsSuccess(true);
            setVideoFile(null);
            setUrl("");
            setName("");
        } else {
            notyf.error(result.error || "Error al subir el video");
        }

        setIsSubmitting(false);
        setDisabled(false);
    };

    return (
        <div className="min-h-screen  p-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Traductor de videos</h1>
                    <p className="mt-2 text-gray-600">Traduce un video en +20 idiomas en minutos</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">

                    <div>
                        <label htmlFor="voiceName" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la voz *
                        </label>
                        <input
                            type="text"
                            id="voiceName"
                            required
                            value={name}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            placeholder="Ej: video personal"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-3 text-center">
                            ¿Cómo deseas subir el video?
                        </label>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                className={`px-4 py-2 w-40 rounded-lg font-medium text-white transition-colors 
                  ${typeVideo === 'url' ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                                onClick={() => setTypeVideo('url')}
                            >
                                Ingresar URL
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 w-40 rounded-lg font-medium text-white transition-colors 
                  ${typeVideo === 'file' ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                                onClick={() => setTypeVideo('file')}
                            >
                                Subir archivo
                            </button>
                        </div>
                    </div>

                    {typeVideo === 'url' && (
                        <div>
                            <label htmlFor="urltext" className="block text-sm font-medium text-gray-700 mb-1">
                                URL del video *
                            </label>
                            <input
                                type="text"
                                id="urltext"
                                required
                                value={url}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="Ej: http://youtube.com/video-ejemplo"
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    )}

                    {typeVideo === 'file' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Archivo de video *
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                                            <span>Click aquí para subir un video</span>
                                            <input
                                                id="video-file"
                                                type="file"
                                                accept="video/mp4, video/quicktime"
                                                required
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">MOV o MP4</p>
                                </div>
                            </div>
                            {videoFile && (
                                <div className="mt-2 flex items-center text-sm text-gray-600">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    {videoFile.name}
                                    <button
                                        type="button"
                                        onClick={() => setVideoFile(null)}
                                        className="ml-2 text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selecciona num de hablantes *
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            onChange={(e) => setNumSpeakers(e.target.value)}
                            required
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selecciona el idioma del video *
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            onChange={(e) => setLanguageSource(e.target.value)}
                            required
                            value={languageSource}
                        >
                            {languagesSources.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.language} {languageSource === l.id ? "✔️" : ""}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selecciona el idioma a traducir *
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            onChange={(e) => setLanguageTarget(e.target.value)}
                            required
                        >
                            {languagesTarget.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.language} {languagetarget === l.id ? "✔️" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="speakerBoost" className="block text-sm font-medium text-gray-700 mb-1">
                            Marca de agua
                        </label>
                        <input
                            type="text"
                            value="Activado"
                            readOnly
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                ${isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} 
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                    >
                        {isSubmitting ? 'Procesando...' : 'Subir y traducir video'}
                    </button>
                </form>

                {isSuccess && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex">
                            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                            <div>
                                <h3 className="text-sm font-medium text-green-800">¡Video enviado con exito!</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Tu video esta casi listo, espera unos minutos a que se termine de doblar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-10">
                <VideosDubbed videos={localVideosDubbed} setVideos={setLocalVideosDubbed} setDisabled={setDisabled} />
            </div>

        </div>

    );
}

export default dubbing;