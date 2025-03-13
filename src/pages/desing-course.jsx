import { useState } from "react"
import {  getSession } from "next-auth/react";
import CreateSchema from "@/components/desing-course/schema/Create-schema";
import SchemaSee from "@/components/Modal/SchemaSee";

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      props: {
        courseData: {},
      },
    };
  }
  if (session.user && session.user.email) {
    const dataRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course/course-data?email=${session.user.email}`);
    const dataCourse = await dataRes.json();


    return {
      props: {
        courseData: dataCourse.courseData || {},
      },
    };
  }

  return {
    props: {
      courseData: {},
    },
  };
}


function desingCourse({courseData}) {
  const [schema, setSchema] = useState(courseData?.schema||"");
  const [contentCourse, setContentCourse] = useState(courseData);
  const [generatedSchema, setGeneratedSchema] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
   
  return (
      <div className="flex flex-col items-center justify-center mt-7">
      <div className="p-4 w-full max-w-3xl rounded-lg ">
        <CreateSchema courseData={courseData}  schema={schema} setSchema={setSchema} contentCourse={contentCourse} setContentCourse={setContentCourse} generatedSchema={generatedSchema} setGeneratedSchema={setGeneratedSchema} openModal={()=>setIsOpenModal(true)}/>
      </div>
      <SchemaSee isOpen={isOpenModal} closeModal={()=>setIsOpenModal(false)} schema={schema}/>
    </div>
  );
}

export default desingCourse;