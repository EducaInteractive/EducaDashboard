"use client"
import { deleteVoice } from "services/voices";
import notyf from "@/utils/notificacion";
import { Trash2 } from "lucide-react";
export default function Voices({ voices ,setVoices,setLocalAmountVoicesClo}) {

    const handleDeleteVoice = async (voice) => {
        if (!voice) return;
        
        if (window.confirm(`Desea eliminar la voz: ${voice.name}?`)) {
          const result = await deleteVoice(voice);
          
          if (result.success) {
            setVoices(result.updatedVoices);
            setLocalAmountVoicesClo(prev => prev - 1);
            notyf.success("Voz eliminada con éxito");
          } else {
            notyf.error(result.error);
          }
        }
      };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className="mt-20 rounded-xl shadow-sm overflow-hidden">
            <div className='flex justify-center items-center '>
                <p className='text-3xl font-bold text-gray-800'>Voces clonadas</p>
            </div>
            {voices.length === 0 && (
                <div className='flex items-center justify-center'>
                    <p colSpan="3" className="px-6 py-4 text-center">
                        No hay voces clonadas
                    </p>
                </div>
            )}
            {voices.length > 0 &&
                <div className="overflow-x-auto mt-5">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Id
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Voz
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Creacion
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Eliminar
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {voices.length > 0 && voices.map((voice) => {
                                const dateFormated = formatDate(voice.date)
                                return (
                                    <tr key={voice.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{voice.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{voice.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{dateFormated}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                            <button
                                                onClick={() => handleDeleteVoice(voice)}
                                                className="text-red-600 hover:text-red-900 "
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}