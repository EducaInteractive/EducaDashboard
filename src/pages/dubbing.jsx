import { useState } from "react";
import { Upload } from "lucide-react";
import notyf from "@/utils/notificacion";
import { CheckCircle, X } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import VideosDubbed from '@/components/dubbing/VideosDubbed';
import { getSession } from "next-auth/react";
import { useDisabled } from "@/contexts/DisabledContext";


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

        const videosDubbedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-videos-dubbed?email=${session.user.email}`);
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
    const [languageSource, setLanguageSource] = useState('Detect')
    const [languagetarget, setLanguageTarget] = useState('en')

    const { data: session } = useSession()

    const languagesSources = [
        { id: "detect", language: "Detect" },
        { id: "en", language: "English" },
        { id: "af", language: "Afrikaans" },
        { id: "ar", language: "Arabic" },
        { id: "hy", language: "Armenian" },
        { id: "az", language: "Azerbaijani" },
        { id: "be", language: "Belarusian" },
        { id: "bs", language: "Bosnian" },
        { id: "bg", language: "Bulgarian" },
        { id: "ca", language: "Catalan" },
        { id: "zh", language: "Chinese" },
        { id: "hr", language: "Croatian" },
        { id: "cs", language: "Czech" },
        { id: "da", language: "Danish" },
        { id: "nl", language: "Dutch" },
        { id: "et", language: "Estonian" },
        { id: "fi", language: "Finnish" },
        { id: "fr", language: "French" },
        { id: "gl", language: "Galician" },
        { id: "de", language: "German" },
        { id: "el", language: "Greek" },
        { id: "he", language: "Hebrew" },
        { id: "hi", language: "Hindi" },
        { id: "hu", language: "Hungarian" },
        { id: "is", language: "Icelandic" },
        { id: "id", language: "Indonesian" },
        { id: "it", language: "Italian" },
        { id: "ja", language: "Japanese" },
        { id: "kn", language: "Kannada" },
        { id: "kk", language: "Kazakh" },
        { id: "ko", language: "Korean" },
        { id: "lv", language: "Latvian" },
        { id: "lt", language: "Lithuanian" },
        { id: "mk", language: "Macedonian" },
        { id: "ms", language: "Malay" },
        { id: "mr", language: "Marathi" },
        { id: "mi", language: "Maori" },
        { id: "ne", language: "Nepali" },
        { id: "no", language: "Norwegian" },
        { id: "fa", language: "Persian" },
        { id: "pl", language: "Polish" },
        { id: "pt", language: "Portuguese" },
        { id: "ro", language: "Romanian" },
        { id: "ru", language: "Russian" },
        { id: "sr", language: "Serbian" },
        { id: "sk", language: "Slovak" },
        { id: "es", language: "Spanish" },
        { id: "sw", language: "Swahili" },
        { id: "sv", language: "Swedish" },
        { id: "tl", language: "Tagalog" },
        { id: "ta", language: "Tamil" },
        { id: "th", language: "Thai" },
        { id: "tr", language: "Turkish" },
        { id: "uk", language: "Ukrainian" },
        { id: "ur", language: "Urdu" },
        { id: "vi", language: "Vietnamese" },
        { id: "cy", language: "Welsh" }
    ];

    const languagesTarget = [
        { id: "en", language: "English" },
        { id: "zh", language: "Chinese" },
        { id: "es", language: "Spanish" },
        { id: "hi", language: "Hindi" },
        { id: "pt", language: "Portuguese" },
        { id: "fr", language: "French" },
        { id: "ja", language: "Japanese" },
        { id: "de", language: "German" },
        { id: "ar", language: "Arabic" },
        { id: "ko", language: "Korean" },
        { id: "ru", language: "Russian" },
        { id: "id", language: "Indonesian" },
        { id: "it", language: "Italian" },
        { id: "nl", language: "Dutch" },
        { id: "tr", language: "Turkish" },
        { id: "pl", language: "Polish" },
        { id: "sv", language: "Swedish" },
        { id: "fi", language: "Finnish" },
        { id: "ms", language: "Malay" },
        { id: "ro", language: "Romanian" },
        { id: "el", language: "Greek" },
        { id: "cs", language: "Czech" },
        { id: "da", language: "Danish" },
        { id: "bg", language: "Bulgarian" },
        { id: "hr", language: "Croatian" },
        { id: "sk", language: "Slovak" },
        { id: "ta", language: "Tamil" }
    ];

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
        if (!name || !typeVideo || !languagetarget || !numSpeakers) return notyf.error("Complete los campos")
        if (typeVideo === "url") {
            if (!url) return notyf.error("Complete la URL");
            if (!url.startsWith("https://")) return notyf.error("La URL debe ser segura (HTTPS)");
            const unsafeDomains = ["example.com", "malware-site.com", "phishing-site.net"];
            try {
                const domain = new URL(url).hostname;
                if (unsafeDomains.includes(domain)) return notyf.error("La URL no es segura");
            } catch (error) {
                return notyf.error("La URL no es válida");
            }
        }
        if (typeVideo == 'file' && !videoFile) return notyf.error("Cargue el archivo")
        setDisabled(true)
        setIsSubmitting(true);
        try {
            let response;

            if (typeVideo === 'file' && videoFile) {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', session.user.email);
                formData.append('videoFile', videoFile);
                formData.append('sourceLang', languageSource === 'Detect' ? 'auto' : languageSource);
                formData.append('targetLang', languagetarget);
                formData.append('numSpeakers', numSpeakers);

                response = await fetch('/api/dubbing', {
                    method: 'POST',
                    body: formData,
                });
            } else if (typeVideo === 'url' && url) {
                response = await fetch('/api/dubbing', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: session.user.email,
                        videoUrl: url,
                        sourceLang: languageSource === 'Detect' ? 'auto' : languageSource,
                        targetLang: languagetarget,
                        numSpeakers: numSpeakers,
                    }),
                });
            }
            if (response.ok) {
                const data = await response.json();
                setLocalVideosDubbed(prev => [...(prev || []), { idVideo: data.dubbing_id, name: name, targetLang: languagetarget,status:"creating" }]);
                setIsSuccess(true);
                setVideoFile(null);
                setUrl("");
                setName("");
            }
            else {
                notyf.error("error al subir el video")
            }
        } catch (error) {
            console.error('Error al iniciar el doblaje:', error);
        }
        setIsSubmitting(false);
        setDisabled(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
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
                        >
                            {languagesSources.map((l) => (
                                <option key={l.id} value={l.id}>{l.language}</option>
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
                                <option key={l.id} value={l.id}>{l.language}</option>
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