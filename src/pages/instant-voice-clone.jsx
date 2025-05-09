import React, { useState, useEffect } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { getSession, useSession } from 'next-auth/react';
import notyf from '@/utils/notificacion';
import { useDisabled } from '@/contexts/DisabledContext';
import { getVoices } from 'services/voices';
import Voices from '@/components/instant-voices-clone/Voices';



export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      props: {
        amountVoicesClo: 0
      },
    };
  }
  if (session.user && session.user.email) {

    const amountVoicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voices/voices?email=${session.user.email}`);
    const amountVoicesData = await amountVoicesRes.json();

    return {
      props: {
        amountVoicesClo: amountVoicesData.amountVoicesClon || 0,
      },
    };
  }

  return {
    props: {
      amountVoicesClo: 0,
    },
  };

}

function InstantVoiceClone({ amountVoicesClo }) {
  const { setDisabled } = useDisabled();
  const [audioFile, setAudioFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [noise, setNoise] = useState(false);
  const [consent, setConsent] = useState(false);
  const [voices, setVoices] = useState([]);
  const [localAmountVoicesClo, setLocalAmountVoicesClo] = useState(amountVoicesClo);
  const { data: session } = useSession();
  const amountMaxVoices = session?.user?.cantVoices;

  const fetchVoices = async () => {
    if (!session?.user?.email) return;
    
    const result = await getVoices(session.user.email);
    
    if (result.success) {
      setVoices(result.voices);
    } else {
      notyf.error(result.error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchVoices();
    }
  }, [session]);

  const VerifyName = () => {
    const searchName = voices.find((n) => String(n.name).toLowerCase() === name.toLowerCase());
    return !!searchName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile || !name.trim()) return notyf.error("Rellene los campos obligatorios!");

    if (!consent) return notyf.error("Necesitas darnos tu consentimiento para realizar esta acción");

    if (VerifyName()) return notyf.error("El nombre ya está en uso");

    if (localAmountVoicesClo === amountMaxVoices) return notyf.error("Límite de clonación alcanzado, aumente su plan para más clonaciones");

    setIsSubmitting(true);
    setDisabled(true);

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("name", name);
    formData.append("noise", noise);
    formData.append("description", description.trim() || "Sin descripción");
    formData.append("amountMaxVoices", amountMaxVoices);
    formData.append("amountVoicesClo", localAmountVoicesClo);
    formData.append("email", session.user.email);

    
    try {
      const resul = await fetch(`/api/voice-clone/upload-audio`, {
        method: "POST",
        body: formData,
      });

      if (resul.status === 200) {
        notyf.success("¡Voz clonada con éxito!");
        sessionStorage.removeItem("voicesi")
        fetchVoices();
        setIsSubmitting(false);
        setIsSuccess(true);
        setLocalAmountVoicesClo((prev) => prev + 1);
      }
    } catch (error) {
      notyf.error("Hubo un error al clonar la voz.");
      setIsSubmitting(false);
    } finally {
      setAudioFile(null)
      setName("")
      setDescription("")
      setDisabled(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
      if (!validAudioTypes.includes(file.type)) {
        notyf.error("Por favor, sube un archivo de audio válido (MP3 o WAV).");
        setAudioFile(null);
        return;
      }

      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        notyf.error("El archivo es demasiado grande. El tamaño máximo permitido es de 10MB.");
        setAudioFile(null);
        return;
      }

      setAudioFile(file);
    }
  };



  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Clonación de Voz</h1>
          <p className="mt-2 text-gray-600">Crea tu voz personalizada en minutos</p>
          <p className="mt-1 text-sm font-medium text-purple-600">
            Voces clonadas: {localAmountVoicesClo}/{amountMaxVoices}
          </p>
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
              placeholder="Ej: Mi Voz Personal"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Archivo de audio *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="audio-file" className=" relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                    <span>Click aquí para subir un archivo</span>
                    <input
                      id="audio-file"
                      type="file"
                      accept="audio/*"
                      required
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">WAV o MP3 hasta 10MB</p>
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="removeNoise"
              value={noise}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              onChange={(e) => setNoise(e.target.checked)}
            />
            <label htmlFor="removeNoise" className="ml-2 block text-sm text-gray-700">
              Eliminar ruido de fondo
            </label>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Describe las características de tu voz..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="consent"
              required
              value={consent}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              onChange={(e) => setConsent(e.target.checked)}
            />
            <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
              Doy mi consentimiento para clonar esta voz y acepto los términos de uso *
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
              ${isSubmitting
                ? 'bg-purple-400'
                : 'bg-purple-600 hover:bg-purple-700'} 
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          >
            {isSubmitting ? 'Procesando...' : 'Subir y generar voz'}
          </button>
        </form>

        {isSuccess && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">¡Voz generada con éxito!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Tu voz ha sido clonada correctamente.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <Voices voices={voices} setLocalAmountVoicesClo={setLocalAmountVoicesClo} setVoices={setVoices} />
      </div>
    </div >
  );
};

export default InstantVoiceClone;