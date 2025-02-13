"use client"
import { Waves, Sparkles, Rocket } from 'lucide-react';
import Link from 'next/link';

function Home() {
  return (
    <div className="sm:h-[890px] h-[1000px] bg-gradient-to-b from-white to-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Voice AI Educa
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Tu portal a la transformación de voz con ElevenLabs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Link href="/text-to-speech">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center mb-4 text-purple-600">
                <Waves className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Text to Speech</h2>
              </div>
              <p className="text-gray-600">
                Transforma texto escrito en voz natural y expresiva. Personaliza el tono,
                la emoción y el estilo para crear experiencias auditivas únicas.
              </p>
            </div>
          </Link>

          <Link href="/instant-voice-clone">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center mb-4 text-blue-600">
                <Sparkles className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Instant Voice Clone</h2>
              </div>
              <p className="text-gray-600">
                Clona voces al instante manteniendo su esencia y naturalidad.
                Ideal para crear contenido personalizado con voces auténticas.
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Potenciado por ElevenLabs
              </h2>
              <p className="text-gray-600 max-w-lg">
                Conectamos con la tecnología de punta de ElevenLabs para ofrecerte
                las mejores herramientas de síntesis y clonación de voz. Experimenta
                la nueva era de la comunicación digital.
              </p>
            </div>
            <Rocket className="w-16 h-16 text-gray-400" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
