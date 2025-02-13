"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import notyf from '@/utils/notificacion';
import { getSession } from 'next-auth/react';
import { useDisabled } from '@/contexts/DisabledContext';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        voices: [], 
      },
    };
  }

  if (session.user && session.user.email) {
    const voicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-voices?email=${session.user.email}`);
    const voicesData = await voicesRes.json();
    return {
      props: {
        voices: voicesData.voices || [],
      },
    };
  }

  return {
    props: {
      voices: [],
    },
  };
}
function TextToSpeech({ voices }) {
  const { setDisabled } = useDisabled();
  const [text, setText] = useState("");
  const [voice, setVoice] = useState(voices.length > 0 ? voices[0].id : "");
  const [stability, setStability] = useState(50);
  const [similarity, setSimilarity] = useState(75);
  const [style, setStyle] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');


  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isSuccess]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text || !voice) return notyf.error("complete los campos requeridos")
    setIsSubmitting(true);
    setDisabled(true)

    try {
      const response = await fetch('/api/upload-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          stability: stability / 100,
          similarity_boost: similarity / 100,
          style_weight: style / 100,
        })
      });

      const data = await response.json();

      if (data.success) {
        setAudioUrl(data.audioUrl);
        setIsSuccess(true);
        notyf.success("Audio generado con exito!!")
        setTimeout(() => {
          setDisabled(false)
        }, 3000);

      } else {
        notyf.error("No se pudo generar el audio.")
      }
    } catch (error) {
      console.error('Error:', error);
      notyf.error("Error al generar el audio.")
    } finally {
      setIsSubmitting(false);
      setDisabled(false)
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Texto a Voz</h1>
          <p className="mt-2 text-gray-600">Convierte texto en voz con parámetros personalizables</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
              Texto (máx. 5000 caracteres) *
            </label>
            <textarea
              id="text"
              required
              maxLength={5000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Introduce el texto a convertir en voz..."
              rows={6}
            />
            <p className='text-[13px] text-gray-600'>{text.length}/5000</p>
          </div>

          <div>
            <label htmlFor="voice" className="block text-sm font-medium text-gray-700 mb-1">
              Selección de voz *
            </label>
            <select
              id="voice"
              required
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              {voices.length===0 && <option value="" disabled>No tinenes voces clonadas</option>}          
              {voices.length > 0 &&
                voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input
              type="text"
              value="Eleven Multilingual V2"
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="stability" className="block text-sm font-medium text-gray-700 mb-1">
              Estabilidad
            </label>
            <input
              type="range"
              id="stability"
              min="1"
              max="100"
              value={stability}
              onChange={(e) => setStability(e.target.value)}
              className="w-full accent-purple-600"
            />
            <p className="text-sm text-gray-500 mt-1">{stability}%</p>
          </div>

          <div>
            <label htmlFor="similarity" className="block text-sm font-medium text-gray-700 mb-1">
              Similitud
            </label>
            <input
              type="range"
              id="similarity"
              min="1"
              max="100"
              value={similarity}
              onChange={(e) => setSimilarity(e.target.value)}
              className="w-full accent-purple-600"
            />
            <p className="text-sm text-gray-500 mt-1">{similarity}%</p>
          </div>

          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
              Estilo
            </label>
            <input
              type="range"
              id="style"
              min="1"
              max="100"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full accent-purple-600"
            />
            <p className="text-sm text-gray-500 mt-1">{style}%</p>
          </div>

          <div>
            <label htmlFor="speakerBoost" className="block text-sm font-medium text-gray-700 mb-1">
              Speaker Boost
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
            ${isSubmitting
                ? 'bg-purple-400'
                : 'bg-purple-600 hover:bg-purple-700'} 
            transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          >
            {isSubmitting ? 'Procesando...' : 'Generar voz'}
          </button>
        </form>

        {isSuccess && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex flex-col">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">¡Voz generada con éxito!</h3>
                </div>
              </div>

              {audioUrl && (
                <div className="mt-4">
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full"
                  >
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              )}

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = audioUrl;
                  link.download = 'audio.mp3';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-4 text-green-700 hover:text-green-600 font-medium underline cursor-pointer"
              >
                Descargar archivo de voz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextToSpeech;