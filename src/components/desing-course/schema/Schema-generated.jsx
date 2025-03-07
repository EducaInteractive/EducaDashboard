"use client"
import { EyeIcon } from "lucide-react";


export default function SchemaGenerated({ generatedSchema, schema, generatedSchemaHandler, isSaving, openModal }) {

    return (
        <div>
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
                <div className="text-center mb-6 flex items-center justify-center gap-2">
                    <p className="mt-2 text-gray-700 text-[17px]">
                        {generatedSchema ? "Generando..." : "Esquema generado"}
                    </p>
                    {!generatedSchema && (
                        <button onClick={openModal} className="flex items-center gap-1 mt-2 text-gray-600 hover:text-gray-900 hover:bg-gray-300 bg-gray-100 rounded-lg px-2 transition-colors">
                            <span className="text-sm font-medium">Ver</span>
                            <EyeIcon className="w-5 h-5" />
                        </button>

                    )}
                </div>

                <div>
                    <textarea className="p-2 whitespace-pre-line bg-gray-50 w-full overflow-y-auto resize-y max-h-[300px]"
                        disabled rows={9} value={schema || ""}>
                    </textarea>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        onClick={generatedSchemaHandler}
                        type="submit"
                        disabled={generatedSchema || isSaving}
                        className={`w-[190px] py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                ${generatedSchema || isSaving ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                    >
                        Generar Alternativa
                    </button>
                </div>
            </div>
        </div>
    );
}
