import React from 'react';

const ThirdStep = ({ datosCurso, actualizarDatos, generarEsquema,submitting}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    generarEsquema();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="bibliografias" className="block text-sm font-medium text-gray-700 mb-1">
          Bibliografías *
        </label>
        <textarea
          id="bibliografias"
          required
          value={datosCurso.bibliografias}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors overflow-y-auto resize-y max-h-[300px]"
          placeholder="Incluye las fuentes bibliográficas recomendadas para el curso..."
          rows={3}
          onChange={(e) => actualizarDatos({ bibliografias: e.target.value })}
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="estudios" className="block text-sm font-medium text-gray-700 mb-1">
          Estudios Científicos *
        </label>
        <textarea
          id="estudios"
          required
          value={datosCurso.estudios}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors overflow-y-auto resize-y max-h-[300px]"
          placeholder="Incluye estudios científicos relevantes para el curso..."
          rows={3}
          onChange={(e) => actualizarDatos({ estudios: e.target.value })}
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
  );
};

export default ThirdStep;