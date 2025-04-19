import React from 'react';
import { X } from 'lucide-react';
const FirtStep = ({ datosCurso, actualizarDatos, avanzarPaso, submitting, handleCancelEdition, cancelEdition }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    avanzarPaso();
  };

  return (
    <div>
      {cancelEdition &&
        <div className="flex items-center justify-center ">
          <button
            onClick={handleCancelEdition}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 py-2 px-4 rounded-lg border border-purple-200 hover:bg-purple-50 transition-all"
          >
            <X className="w-4 h-4" />
            <span>Cancelar Edición</span>
          </button>
        </div>
      }

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título del Curso *
          </label>
          <input
            type="text"
            id="titulo"
            required
            value={datosCurso.titulo}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            placeholder="ej: Marketing Digital Avanzado"
            onChange={(e) => actualizarDatos({ titulo: e.target.value })}
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Publico Objetivo *
          </label>
          <input
            type="text"
            id="titulo"
            required
            value={datosCurso.publicoObjetivo}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            placeholder="ej: Personas jovenes"
            onChange={(e) => actualizarDatos({ publicoObjetivo: e.target.value })}
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="temasPrincipales" className="block text-sm font-medium text-gray-700 mb-1">
            Contenidos Particulares *
          </label>
          <textarea
            id="temasPrincipales"
            value={datosCurso.contenidosParticulares}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors overflow-y-auto resize-y max-h-[300px]"
            placeholder="ej: Experiencia en CEO de Marketing"
            rows={4}
            onChange={(e) => actualizarDatos({ contenidosParticulares: e.target.value })}
            disabled={submitting}
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className={`${submitting ? "cursor-not-allowed bg-purple-400" : "bg-purple-600 hover:bg-purple-700"} py-3 px-6 border border-transparent rounded-lg shadow-sm text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center min-w-[120px]`}
            disabled={submitting}
          >
            {submitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Generar Esquema'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FirtStep;