import React, { useState, useEffect } from 'react';
import FirtStep from './FirtsStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import notyf from '@/utils/notificacion';
import { useSession } from 'next-auth/react';
import SchemaGenerated from '../Schema-generated';

const FormularioCurso = ({ courseDataSave, setSchema, schema, setLocalDataCourse, localDataCourse, openModal,cantRegenerationsLocal,setCantRegenerationsLocal }) => {
  const [submitting, setSubmitting] = useState(false);
  const [cancelEdition, setCancelEdition] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [dataCourse, setDataCourse] = useState({
    titulo: courseDataSave?.tema || '',
    temasPrincipales: courseDataSave?.content || '',
    contenidosParticulares: courseDataSave?.knowledge || '',
    publicoObjetivo: courseDataSave?.people || '',
    bibliografias: courseDataSave?.bibliografy || '',
    estudios: courseDataSave?.studies || '',
  });

  const { data: session } = useSession();


  useEffect(() => {
    if (courseDataSave) {
      if (courseDataSave?.tema && courseDataSave?.knowledge && courseDataSave?.people) {
        setStep(2)
      }
    }
  }, [courseDataSave]);

  const nextFirtStep = async () => {
    try {
      if (!dataCourse.titulo.trim()) {
        return notyf.error('Por favor, completa los campos obligatorios');
      }
      setSubmitting(true);

      const res = await fetch('/api/chat/firts-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            email: session.user.email,
            tema: dataCourse.titulo,
            content: dataCourse.temasPrincipales
          }
        )
      });

      if (res.ok) {
        setStep(prev => prev + 1);
      } else {
        notyf.error('Error al guardar los datos');
      }
    } catch (error) {
      notyf.error("Error en el servidor");
      console.error("Error en el servidor:", error);
    } finally {
      setSubmitting(false);
    }


  };


  const nextSecondStep = async () => {
    try {
      if (!dataCourse.contenidosParticulares.trim() || !dataCourse.publicoObjetivo.trim()) {
        return notyf.error('Por favor, completa los campos obligatorios');
      }
      setSubmitting(true);

      const res = await fetch('/api/chat/second-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            email: session.user.email,
            knowledge: dataCourse.contenidosParticulares,
            people: dataCourse.publicoObjetivo
          }
        )
      });

      if (res.ok) {
        setStep(prev => prev + 1);
      } else {
        notyf.error('Error al guardar los datos');
      }
    } catch (error) {
      notyf.error("Error en el servidor");
      console.error("Error en el servidor:", error);
    } finally {
      setSubmitting(false);
    }


  };


  const refreshData = (nuevoDatos) => {
    setDataCourse(prevDatos => ({
      ...prevDatos,
      ...nuevoDatos
    }));
  };

  const nextThirdStep = async () => {
    if (!dataCourse.titulo.trim() || !dataCourse.contenidosParticulares.trim() || !dataCourse.publicoObjetivo.trim()) return notyf.error("Complete los campos");

    setGeneratedSchema(true);
    setLocalDataCourse({
      tema: dataCourse.titulo,
      knowledge: dataCourse.contenidosParticulares,
      people: dataCourse.publicoObjetivo,
    });
    setSchema("");
    setStep((prev) => prev + 1);
    try {
      const response = await fetch("/api/chat/third-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          tema: dataCourse.titulo,
          knowledge: dataCourse.contenidosParticulares,
          people: dataCourse.publicoObjetivo,
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
      setGeneratedSchema(false)
    }
  };


  const regenerateSchema = async () => {
    if (generatedSchema) return;
    if(cantRegenerationsLocal>=session.user?.cantRegenerations) return notyf.error("No tiene más regeneraciones disponibles. Aumente su plan para obtener más regeneraciones.")
    setSchema("");
    setGeneratedSchema(true);

    try {
      const response = await fetch("/api/chat/schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          tema: localDataCourse.tema,
          knowledge: localDataCourse.knowledge,
          people: localDataCourse.people,
        }),
      });

      if (response.ok && response.body) {
        setCantRegenerationsLocal(prev=> prev + 1)
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
      }else{
        notyf.error("Error en el servidor")
      }
    } catch (error) {
      notyf.error("Error en el servidor")
      console.error("Error fetching data:", error);
    }
    finally {
      setGeneratedSchema(false);
    }

  }

  const handleBackToStep1 = () => {
    setCancelEdition(true)
    setStep(1);
    setDataCourse({
      titulo: '',
      contenidosParticulares: '',
      publicoObjetivo: '',
    });
  }

  const handleCancelEdition = () => {
    setStep(2);
  }



  const saveSchema = async () => {
    if (generatedSchema || isSaving) return;
    if (!schema) return notyf.error("No se ha generado el esquema")

    if (localDataCourse?.schema && schema === localDataCourse.schema) {
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
    finally {
      setLocalDataCourse((prevContentCourse) => ({
        ...prevContentCourse,
        schema: schema
      }));
      setIsSaving(false);
    }

  }


  return (
    <div className=" max-w-2xl mx-auto py-10 px-4 bg-white p-8 rounded-xl shadow-sm mt-8">
      {step === 1 && (
        <FirtStep
          submitting={submitting}
          datosCurso={dataCourse}
          actualizarDatos={refreshData}
          avanzarPaso={nextThirdStep}
          handleCancelEdition={handleCancelEdition}
          cancelEdition={cancelEdition}
        />
      )}
      {step === 2 && (
        <SchemaGenerated
          schema={schema}
          generatedSchemaHandler={regenerateSchema}
          openModal={openModal}
          isSaving={isSaving}
          generatedSchema={generatedSchema}
          localDataCourse={localDataCourse}
          saveSchema={saveSchema}
          handleBackToStep1={handleBackToStep1}
          cantRegenerationsLocal={cantRegenerationsLocal}
        />
      )}
      {/* <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
          ${step >= s ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                {s}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                {s === 1 ? 'Información Básica' : s === 2 ? 'Audiencia' : s === 3 ? 'Recursos' : "Esquema"}
              </div>
            </div>
          ))}

          <div className="absolute top-5 left-0 right-0 h-[2px] z-0 mt-5">
            <div className="w-full h-full bg-gray-200 flex">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${(step - 1) * (100 / 3)}%` }}  
              ></div>
            </div>
          </div>
        </div>
      </div>
  */}

      {/*<div className="bg-white p-8 rounded-xl shadow-sm">
         

        {step === 2 && (
          <SecondStep
            submitting={submitting}
            datosCurso={dataCourse}
            actualizarDatos={refreshData}
            avanzarPaso={nextSecondStep}
          />
        )}

        {step === 3 && (
          <ThirdStep
            submitting={submitting}
            datosCurso={dataCourse}
            actualizarDatos={refreshData}
            generarEsquema={nextThirdStep}
          />
        )}
          

      </div>*/}
    </div>
  );
};

export default FormularioCurso;