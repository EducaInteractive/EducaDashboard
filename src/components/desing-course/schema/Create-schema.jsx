"use client"

import { useState } from "react"
import SchemaGenerated from "./Schema-generated";
import { useSession } from "next-auth/react";
import notyf from "@/utils/notificacion";


export default function CreateSchema({ schema, setSchema, contentCourse, setContentCourse, generatedSchema, setGeneratedSchema,openModal }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(Object.keys(contentCourse).length === 0);
    const [tema, setTema] = useState(contentCourse.tema || "");
    const [content, setContent] = useState(contentCourse.content || "");
    const [knowledge, setKnowledge] = useState(contentCourse.knowledge || "");
    const [people, setPeople] = useState(contentCourse.people || "");
    const { data: session } = useSession();



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tema || !content || !knowledge) return notyf.error("Falta completar datos")
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/course/course-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: session.user.email,
                    tema,
                    content,
                    knowledge,
                    people
                })
            })

            if (res.ok) {
                setContentCourse({ tema, content, knowledge,people });
                notyf.success("Datos guardados correctamente");
                setGeneratedSchema(true)
                setIsEditing(false);
                generatedSchemaHandler();
            }
        } catch (error) {
            console.log(error)
            notyf.error("Error al guardar los datos")
        }
        setIsSubmitting(false);
    }

    const generatedSchemaHandler = async () => {
        setSchema("");
        setGeneratedSchema(true);

        try {
            const response = await fetch("/api/chat/schema", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tema,
                    content,
                    knowledge,
                    people
                }),
            });

            if (response.ok && response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                let done = false;
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;

                    if (value) {
                        const chunkValue = decoder.decode(value, { stream: !done });

                        setSchema((prevSchema) => prevSchema + chunkValue);
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        finally {
            
            setGeneratedSchema(false);
        }

    }

    const saveSchema = async () => {
        if (generatedSchema) return;
        if (!schema) return notyf.error("No se ha generado el esquema")

        if (contentCourse?.schema && schema === contentCourse.schema) {
            notyf.error("El Esquema ya ha sido guardado")
            return
        }
        setIsSaving(true)
        try {
            const res = await fetch("/api/course/course-data", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: session.user.email,
                    schema: schema
                })
            })
            if (res.ok) {
                notyf.success("Esquema guardado correctamente")
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setContentCourse((prevContentCourse) => ({
                ...prevContentCourse,
                schema: schema
            }));
            setIsSaving(false);
        }

    }
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Diseña tu curso</h1>
                    <p className="mt-2 text-gray-600">ayudate de inteligencia artificial para crear tu curso</p>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
                        <div>
                            <label htmlFor="tema" className="block text-sm font-medium text-gray-700 mb-1">
                                Tema *
                            </label>
                            <input
                                type="text"
                                id="tema"
                                required
                                value={tema}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="ej: Marketing"
                                onChange={(e) => setTema(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                Contenido principal *
                            </label>
                            <textarea
                                id="content"
                                required
                                value={content}
                                maxLength={5000}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="Escribe el contenido principal del curso..."
                                rows={6}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="knowledge" className="block text-sm font-medium text-gray-700 mb-1">
                            Contenidos particulares *
                            </label>
                            <input
                                type="text"
                                id="knowledge"
                                required
                                value={knowledge}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="ej: Experiencia en marketing digital"
                                onChange={(e) => setKnowledge(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="knowledge" className="block text-sm font-medium text-gray-700 mb-1">
                            Público objetivo *
                            </label>
                            <input
                                type="text"
                                id="knowledge"
                                required
                                value={people}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="ej: personas jovenes interesadas en marketing"
                                onChange={(e) => setPeople(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-7 items-center justify-center">

                            {Object.keys(contentCourse).length > 0 && <button
                                type="button"
                                disabled={isSubmitting}
                                className={`w-[150px] py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                  ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                                onClick={() => setIsEditing(false)}
                            >
                                Cancelar
                            </button>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-[150px] py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                  ${isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
                            <div className="text-center mb-6">
                                <p className="mt-2 text-gray-700 text-[17px]">Información del curso guardada</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Tema</h3>
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{contentCourse.tema}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Contenido principal</h3>
                                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 max-h-60 overflow-y-auto">
                                        <textarea className="whitespace-pre-line bg-gray-50 w-full" disabled rows={6} defaultValue={contentCourse.content}></textarea>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Contenidos particulares</h3>
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{contentCourse.knowledge}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Público objetivo</h3>
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{contentCourse.people}</p>
                                </div>
                            </div>
                            <div className="flex justify-center pt-4">
                                <button
                                    disabled={generatedSchema}
                                    onClick={() => setIsEditing(true)}
                                    className={`${generatedSchema ? "bg-purple-400 cursor-not-allowed" : "  bg-purple-600 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"} py-3 px-6 border border-transparent rounded-lg shadow-sm text-white font-medium`}
                                >
                                    Editar informacion
                                </button>
                            </div>
                        </div>
                        <div className="mt-8">
                            <SchemaGenerated generatedSchema={generatedSchema} schema={schema} generatedSchemaHandler={generatedSchemaHandler} isSaving={isSaving} openModal={openModal} />
                        </div>
                        <div className="mt-5">
                            <button
                                onClick={saveSchema}
                                type="button"
                                disabled={generatedSchema || isSaving}
                                className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                    ${generatedSchema || isSaving ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                    transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar esquema'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

