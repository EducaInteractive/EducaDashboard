"use client";
import { useRef, useEffect, useState } from "react";
import { Expand, Save, RefreshCw, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import CourseInfoPDFDownloader from "./CourseInfoPDFDownloader";
export default function SchemaGenerated({
    generatedSchema,
    schema,
    generatedSchemaHandler,
    isSaving,
    openModal,
    localDataCourse,
    saveSchema,
    handleBackToStep1,
    cantRegenerationsLocal
}) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const {data:session}=useSession();
    const cantRegenerations=session?.user?.cantRegenerations||0;

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center mb-8">
                <p className="mt-1 text-sm font-medium text-purple-600">
                    Esquemas regenerados: {cantRegenerationsLocal}/{cantRegenerations}
                </p>
            </div>
            <div className="self-start">
                <button
                    onClick={handleBackToStep1}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-800 py-2 px-4 rounded-lg border border-purple-200 hover:bg-purple-50 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Editar información del curso</span>
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-purple-50 p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-purple-800 text-center">
                        Información del Curso
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <InfoField
                            label="Titulo"
                            value={localDataCourse.tema}
                        />

                        <InfoField
                            label="Público objetivo"
                            value={localDataCourse.people}
                        />
                    </div>

                    <ExpandableField
                        label="Contenidos particulares"
                        value={localDataCourse.knowledge}
                    />

                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-purple-50 p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-purple-800">
                        {generatedSchema ? "Generando esquema..." : schema ? "Esquema del Curso" : "Generar Esquema del Curso"}
                    </h2>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 bg-white hover:bg-purple-50 rounded-lg px-3 py-1 text-sm transition-all border border-purple-200"
                    >
                        <span className="font-medium">Expandir</span>
                        <Expand className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 mb-5">
                        <textarea
                            className="p-4 w-full bg-transparent resize-none focus:outline-none"
                            disabled
                            rows={10}
                            value={schema}
                            placeholder="El esquema generado aparecerá aquí..."                    
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={generatedSchemaHandler}
                            disabled={generatedSchema || isSaving}
                            className={`py-3 px-4 rounded-lg shadow-sm text-white font-medium flex items-center justify-center gap-2
                ${generatedSchema || isSaving ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                transition-all focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                        >
                            <RefreshCw className={`w-5 h-5 ${generatedSchema ? 'animate-spin' : ''}`} />
                            Generar Alternativa
                        </button>

                        <CourseInfoPDFDownloader schema={schema} localDataCourse={localDataCourse} generateSchema={generatedSchema} isSaving={isSaving} />

                        <button
                            onClick={saveSchema}
                            disabled={generatedSchema || isSaving}
                            className={`py-3 px-4 rounded-lg shadow-sm text-white font-medium flex items-center justify-center gap-2
                ${isSaving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} 
                transition-all focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                        >
                            <Save className="w-5 h-5" />
                            {isSaving ? 'Guardando...' : 'Guardar Esquema'}
                        </button>
                    </div>
                </div>
            </div>

            <div ref={bottomRef}></div>
        </div>
    );
}


function InfoField({ label, value, isTextarea = false, rows = 3 }) {
    return (
        <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1.5">{label}</h3>
            {isTextarea ? (
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                    <textarea
                        className="p-3 w-full bg-transparent resize-none focus:outline-none"
                        disabled
                        rows={rows}
                        defaultValue={value}
                    />
                </div>
            ) : (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                    {value}
                </div>
            )}
        </div>
    );
}

function ExpandableField({ label, value }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isLongContent = value && value.length > 200;

    return (
        <div>

            <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-medium text-gray-700">{label}</h3>
                {isLongContent && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-purple-600 hover:text-purple-800 flex items-center text-xs"
                    >
                        {isExpanded ? (
                            <>
                                <span>Mostrar menos</span>
                                <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                        ) : (
                            <>
                                <span>Mostrar más</span>
                                <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
                <div
                    className={`p-3 overflow-y-auto ${isExpanded ? 'max-h-80' : 'max-h-32'} transition-all duration-300`}
                >
                    {isLongContent ? (
                        <textarea
                            className="w-full bg-transparent resize-none focus:outline-none"
                            disabled
                            rows={isExpanded ? 12 : 5}
                            defaultValue={value}
                        />
                    ) : (
                        <div className="text-gray-800">{value}</div>
                    )}
                </div>
            </div>
        </div>
    );
}