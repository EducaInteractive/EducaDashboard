"use client"
import notyf from '@/utils/notificacion'
import { Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import VideoSee from '../Modal/VideoSee'


export default function VideosDubbed({ videos, setVideos,setDisabled }) {

    const languagesTarget = [{ id: "en", language: "English" }, { id: "zh", language: "Chinese" }, { id: "es", language: "Spanish" }, { id: "hi", language: "Hindi" }, { id: "pt", language: "Portuguese" }, { id: "fr", language: "French" }, { id: "ja", language: "Japanese" }, { id: "de", language: "German" }, { id: "ar", language: "Arabic" }, { id: "ko", language: "Korean" }, { id: "ru", language: "Russian" }, { id: "id", language: "Indonesian" }, { id: "it", language: "Italian" }, { id: "nl", language: "Dutch" }, { id: "tr", language: "Turkish" }, { id: "pl", language: "Polish" }, { id: "sv", language: "Swedish" }, { id: "fi", language: "Finnish" }, { id: "ms", language: "Malay" }, { id: "ro", language: "Romanian" }, { id: "el", language: "Greek" }, { id: "cs", language: "Czech" }, { id: "da", language: "Danish" }, { id: "bg", language: "Bulgarian" }, { id: "hr", language: "Croatian" }, { id: "sk", language: "Slovak" }, { id: "ta", language: "Tamil" }];
    const [isDownloading, setIsDownloading] = useState({});
    const [isDeleting, setIsDeleting] = useState({});
    const [isOpen, setIsOpen] = useState(false)
    const [url, setUrl] = useState(null)

    const heads = ["Nombre", "Leng-doblado", "Descargar", "Borrar"]


    const deleteDubbing = async (video) => {
        if (!video.idVideo || !video.name) return;
        if (window.confirm(`Estas seguro que desea eliminar a: ${video.name}`)) {
            setIsDeleting(prev => ({ ...prev, [video.idVideo]: true }));
            try {
                const res = await fetch(`/api/videos-dubbed?idVideo=${video.idVideo}`, { method: "DELETE" })
                if (res.ok) {
                    notyf.success("video borrado con exito!");
                    setIsDeleting(prev => ({ ...prev, [video.idVideo]: false }));
                    setVideos(prev => prev.filter(v => v.idVideo !== video.idVideo));
                }
                else {
                    notyf.error("error al eliminar el video");
                }
            } catch (error) {
                console.error(error);
                notyf.error("error en el servidor");
            }
            setIsDeleting(prev => ({ ...prev, [video.idVideo]: false }));
        }
    }


    const downloadVideo = async (idVideo) => {
        if (!idVideo) return;
        setIsDownloading(prev => ({ ...prev, [idVideo]: true }));

        const urlsLocal = JSON.parse(sessionStorage.getItem("urls")) || [];
        const findId = urlsLocal.find(i => i.idVideo === idVideo);
        if (findId) {
            setUrl(findId.url);
            setIsOpen(true);
            setIsDownloading(prev => ({ ...prev, [idVideo]: false }));
            return;
        }
        setDisabled(true)
        try {
            const res = await fetch(`/api/videos-dubbed?idVideo=${idVideo}`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                setUrl(url);
                setIsOpen(true);
                const newUrls = [...urlsLocal, { idVideo, url }];
                sessionStorage.setItem("urls", JSON.stringify(newUrls));
            }
            else if (res.status === 402) {
                notyf.error("¡El video aun se esta doblando!")
            }
        } catch (error) {
            console.error("Error trayendo el video:", error);
            notyf.error("Error al traer el video");
        }
        setDisabled(false)
        setIsDownloading(prev => ({ ...prev, [idVideo]: false }));
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800">Videos traducidos</h3>
            </div>
            {videos.length === 0 && <h3 className=' text-2xl font-semibold text-gray-500'>No hay videos traducidos</h3>}
            {videos.length !== 0 &&
                <div className="overflow-x-auto mt-5">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {heads.map((r, index) => (
                                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {r}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {videos.map((v) => {
                                const langObj = languagesTarget.find((l) => l.id === v.targetLang);
                                return (
                                    <tr key={v.idVideo}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{v.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {langObj ? langObj.language : v.targetLang}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                                            {isDownloading[v.idVideo] ? (
                                                <p>Cargando video...</p>
                                            ) : (
                                                <button
                                                    disabled={isDownloading[v.idVideo]}
                                                    onClick={() => downloadVideo(v.idVideo)}
                                                    className={`${isDownloading[v.idVideo] ? "text-green-300 cursor-not-allowed" : "text-green-600 hover:text-green-800"} `}
                                                >
                                                    <Eye className="h-8 w-5" />
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {isDeleting[v.idVideo] ? (<p>Borrando video...</p>)
                                                :
                                                (<button
                                                    onClick={() => deleteDubbing(v)}
                                                    disabled={isDownloading[v.idVideo]}
                                                    className={`${isDownloading[v.idVideo] ? "text-red-300 cursor-not-allowed" : "text-red-600 hover:text-red-900"} `}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>)
                                            }

                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>
                </div>
            }
            <VideoSee isOpen={isOpen} closeModal={() => setIsOpen(false)} src={url} />
        </div>
    )
}