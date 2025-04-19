import { useState } from "react"
import { getSession } from "next-auth/react";
import SchemaSee from "@/components/Modal/SchemaSee";
import FormularioCurso from "@/components/desing-course/schema/steps/Principal";
import Link from "next/link";

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      props: {
        courseData: {},
        cantRegenerations: 0
      },
    };
  }
  if (session.user && session.user.email) {
    const dataRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course/course-data?email=${session.user.email}`);
    const dataCourse = await dataRes.json();


    return {
      props: {
        courseData: dataCourse.courseData || {},
        cantRegenerations: dataCourse.courseData.count_regenerate || 0
      },
    };
  }

  return {
    props: {
      courseData: {},
      cantRegenerations: 0
    },
  };
}


function desingCourse({ courseData, cantRegenerations }) {
  const [schema, setSchema] = useState(courseData?.schema || "");
  const [coursedataLocal, setCourseDataLocal] = useState(courseData);
  const [cantRegenerationsLocal, setCantRegenerationsLocal] = useState(cantRegenerations);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center gap-20 items-center">
          <h1 className="text-3xl font-bold text-purple-800">Diseña tu curso</h1>
          <Link href={schema?"/create-class":"#"}>
            <p className="text-purple-600 hover:text-purple-800">Siguiente Paso →</p>
          </Link>
        </div>
      </header>
      <FormularioCurso setLocalDataCourse={setCourseDataLocal} localDataCourse={coursedataLocal} courseDataSave={courseData} setSchema={setSchema} schema={schema} openModal={() => setIsOpen(true)} cantRegenerationsLocal={cantRegenerationsLocal} setCantRegenerationsLocal={setCantRegenerationsLocal} />
      <SchemaSee isOpen={isOpen} closeModal={() => setIsOpen(false)} schema={schema} setSchema={setSchema} />

    </>
  );
}

export default desingCourse;