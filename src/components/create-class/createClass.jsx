"use client"

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import notyf from '@/utils/notificacion';

export default function CreateClass({ classesData, courseData1, setIsOpen, session,courseData,setCourseData,classes,setClasses,currentClass,setCurrentClass,editableScript,setEditableScript}) {

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const maxRegenerations = parseInt(session?.user?.cantRegenerationsClass) || 0;

    const title = courseData1.tema;
    useEffect(() => {
        if (classesData && classesData?.outline && classesData?.outline.length > 0) {
            setCourseData(classesData);
            
        }

        if (classesData && classesData.classes && classesData.classes.length > 0) {
            setClasses(classesData.classes);
        }
        
    }, [classesData]);

    const generateClassScript = async (classNumber) => {
        if (isProcessing) return;

        // Check if class has reached regeneration limit
        const existingClass = classes.find(c => c.numberClass === classNumber);
        if (existingClass && existingClass.numberRenegerate >= maxRegenerations) {
            notyf("Has alcanzado el límite de regeneraciones para esta clase.");
            return;
        }

        setIsProcessing(true);
        setIsLoading(true);
        setCurrentClass(classNumber);

        try {
            const response = await fetch("/api/chat/create-class", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: session.user.email,
                    classNumber: classNumber,
                    schema: courseData1.schema
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Accedemos directamente a los datos del ClassData
                const classData = data.ClassData;

                // Update classes array
                const updatedClasses = [...classes];
                const classIndex = updatedClasses.findIndex(c => c.numberClass === classNumber);
                setCourseData((prev) => ({
                    ...prev,
                    outline: prev.outline.map(c =>
                      c.number === classNumber
                        ? { ...c, title: classData.title }
                        : c
                    )
                  }));
                  

                const newClassData = {
                    numberClass: classNumber,
                    title: classData.title,
                    introduction: classData.introduction,
                    development: classData.development,
                    conclusion: classData.conclusion,
                    activity: classData.activity,
                    numberRenegerate: existingClass ? existingClass.numberRenegerate + 1 : 0
                };

                if (classIndex >= 0) {
                    updatedClasses[classIndex] = newClassData;
                } else {
                    updatedClasses.push(newClassData);
                }

                setClasses(updatedClasses);
            } else {
                notyf.error("Error al generar la clase. Por favor intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error generating class:", error);
            alert("Hubo un error al generar la clase. Por favor intenta de nuevo.");
        } finally {
            setIsLoading(false);
            setIsProcessing(false);
        }
    };

    const viewClassContent = (classNumber) => {
        if (isProcessing) return;

        const classExists = classes.find(c => c.numberClass === classNumber);
        if (classExists) {
            setCurrentClass(classNumber);
        } else {
            alert("Esta clase aún no ha sido generada. Haz clic en 'Generar' para crearla.");
        }
    };

    const handleEdit = () => {
        if (isProcessing) return;

        const classToEdit = classes.find(c => c.numberClass === currentClass);
        if (currentClass && classToEdit) {
            setEditableScript({
                title: classToEdit.title,
                introduction: classToEdit.introduction,
                development: classToEdit.development,
                conclusion: classToEdit.conclusion,
                activity: classToEdit.activity
            });
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (isProcessing) return;
        if(!editableScript.title.trim() || !editableScript.introduction.trim() || !editableScript.development.trim() || !editableScript.conclusion.trim() || !editableScript.activity.trim()) {
            notyf.error("Por favor completa todos los campos antes de guardar.");
            return;
        }

        setIsProcessing(true);
        setIsSaving(true);
        
        try {
            const response = await fetch("/api/course/classes-data", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: session.user.email,
                    title: editableScript.title,
                    introduction: editableScript.introduction,
                    development: editableScript.development,
                    conclusion: editableScript.conclusion,
                    activity: editableScript.activity,
                    numberClass: currentClass
                }),
            });

            if (response.ok) {
                notyf.success("Clase guardada con éxito.");
                const updatedClasses = classes.map(classItem => {
                    if (classItem.numberClass === currentClass) {
                        return {
                            ...classItem,
                            title: editableScript.title,
                            introduction: editableScript.introduction,
                            development: editableScript.development,
                            conclusion: editableScript.conclusion,
                            activity: editableScript.activity
                        };
                    }
                    return classItem;
                });
    
                setClasses(updatedClasses);
                setIsEditing(false);
            }
            else{
                notyf.error("Error al guardar los cambios. Por favor intenta de nuevo.");
            }

            // Update classes array
          

        } catch (error) {
            console.error("Error saving class:", error);
            alert("Hubo un error al guardar los cambios. Por favor intenta de nuevo.");
        } finally {
            setIsSaving(false);
            setIsProcessing(false);
        }
    };

    const handleContinue = () => {
        if (isProcessing) return;

        if (currentClass < 4) {
            const nextClass = classes.find(c => c.numberClass === currentClass + 1);
            if (!nextClass) {
                generateClassScript(currentClass + 1);
            } else {
                setCurrentClass(currentClass + 1);
            }
        } else {
            alert("¡Has completado todas las clases del curso!");
        }
    };

    const handleInputChange = (field, value) => {
        setEditableScript(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Course Outline Summary */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className='flex gap-4 items-center mb-4'>
                        <h2 className="text-xl font-semibold">Título del Curso: {title}</h2>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 bg-white hover:bg-purple-50 rounded-lg px-3 py-1 text-sm transition-all border border-purple-200"
                        >
                            <span className="font-medium">Ver Esquema</span>
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {courseData.outline.map((classItem) => {
                            const generatedClass = classes.find(c => c.numberClass === classItem.number);
                            return (
                                <div
                                    key={classItem.number}
                                    className={`p-3 rounded-md flex justify-between items-center cursor-pointer ${isProcessing ? 'opacity-50' : ''} 
                                        ${currentClass === classItem.number ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'}`}
                                    onClick={() => viewClassContent(classItem.number)}
                                >
                                    <div>
                                        <span className="font-medium">Clase {classItem.number}: {classItem.title}</span>
                                        {generatedClass && (
                                            <span className="ml-2 text-green-600 text-sm">✓ Generada</span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-500">
                                            Regeneraciones: {generatedClass ? generatedClass.numberRenegerate : 0}/{maxRegenerations}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                generateClassScript(classItem.number);
                                            }}
                                            className={`px-4 py-2 rounded-md text-white ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                                                ${generatedClass
                                                    ? generatedClass.numberRenegerate >= 1
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-purple-600 hover:bg-purple-700'
                                                }`}
                                            disabled={isProcessing || (generatedClass && generatedClass.numberRenegerate >= maxRegenerations)}
                                        >
                                            {generatedClass ? 'Regenerar' : 'Generar'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-purple-200 mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-700">Creando clase {currentClass}...</h3>
                            <p className="text-gray-500 mt-2">Esto puede tomar unos momentos</p>
                        </div>
                    </div>
                )}

                {/* Saving Indicator */}
                {isSaving && (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-green-200 mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-700">Guardando cambios...</h3>
                            <p className="text-gray-500 mt-2">Esto puede tomar unos momentos</p>
                        </div>
                    </div>
                )}

                {/* Class Content Display/Edit */}
                {!isLoading && !isSaving && currentClass && classes.find(c => c.numberClass === currentClass) && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Clase {currentClass}: {isEditing ? editableScript.title : classes.find(c => c.numberClass === currentClass).title}
                            </h2>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    disabled={isProcessing}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Editar Clase
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleCancel}
                                        disabled={isProcessing}
                                        className={`px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isProcessing}
                                        className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mb-2 text-sm text-gray-500">
                            Curso: {title}
                        </div>

                        {isEditing ? (
                            // Edit Mode - All sections editable at once
                            <div className="space-y-6 mb-6">
                                {/* Title Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Título</h3>
                                    </div>
                                    <div className="p-4">
                                        <input
                                            type="text"
                                            value={editableScript.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>

                                {/* Introduction Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Introducción</h3>
                                    </div>
                                    <div className="p-4">
                                        <textarea
                                            value={editableScript.introduction}
                                            onChange={(e) => handleInputChange('introduction', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                {/* Development Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Desarrollo</h3>
                                    </div>
                                    <div className="p-4">
                                        <textarea
                                            value={editableScript.development}
                                            onChange={(e) => handleInputChange('development', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            rows={8}
                                        />
                                    </div>
                                </div>

                                {/* Conclusion Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Cierre</h3>
                                    </div>
                                    <div className="p-4">
                                        <textarea
                                            value={editableScript.conclusion}
                                            onChange={(e) => handleInputChange('conclusion', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                {/* Activity Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Actividad</h3>
                                    </div>
                                    <div className="p-4">
                                        <textarea
                                            value={editableScript.activity}
                                            onChange={(e) => handleInputChange('activity', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // View Mode - Display sections
                            <div className="space-y-6 mb-6">
                                {/* Introduction Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Introducción</h3>
                                    </div>
                                    <div className="p-4 whitespace-pre-line">
                                        {classes.find(c => c.numberClass === currentClass).introduction}
                                    </div>
                                </div>

                                {/* Development Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Desarrollo</h3>
                                    </div>
                                    <div className="p-4 whitespace-pre-line">
                                        {classes.find(c => c.numberClass === currentClass).development}
                                    </div>
                                </div>

                                {/* Conclusion Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Cierre</h3>
                                    </div>
                                    <div className="p-4 whitespace-pre-line">
                                        {classes.find(c => c.numberClass === currentClass).conclusion}
                                    </div>
                                </div>

                                {/* Activity Section */}
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700">Actividad</h3>
                                    </div>
                                    <div className="p-4 whitespace-pre-line">
                                        {classes.find(c => c.numberClass === currentClass).activity}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleContinue}
                                disabled={isProcessing || isEditing}
                                className={`px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium ${(isProcessing || isEditing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {currentClass < 4 ? `Continuar con Clase ${currentClass + 1}` : 'Finalizar Creación de Clases'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}