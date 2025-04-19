// pages/create-classes.jsx

import { getSession } from 'next-auth/react';
import CreateClass from '@/components/create-class/createClass';
import CreateClassSchemaSee from '@/components/Modal/CreateClassSchemaSee';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {
            props: {
                classesData: [],
                courseData1: {}
            },
        };
    }
    if (session.user && session.user.email) {
        const dataRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course/classes-data?email=${session.user.email}`);
        const data = await dataRes.json();

        return {
            props: {
                classesData: data.classesData || [],
                courseData1: data.courseData || {}
            },
        };
    }

    return {
        props: {
            classesData: [],
            courseData1: {}
        },
    };
}

export default function CreateClasses({ classesData, courseData1 }) {
    const [isOpen, setIsOpen] = useState(false);
    const [schema, setSchema] = useState(courseData1?.schema || '');
    const { data: session } = useSession();
    const [classes, setClasses] = useState([]);
    const [currentClass, setCurrentClass] = useState(null);
    const [editableScript, setEditableScript] = useState({});
    const [courseData, setCourseData] = useState({
        outline: [1, 2, 3, 4].map(number => {
          const match = (classesData?.classes ?? []).find(c => c.numberClass === number);
          return {
            number,
            title: match ? match.title : "Genera para ver el contenido",
            mainTopics: "",
            specificContent: ""
          };
        })
      });
      
    return (
        <div>
            <CreateClassSchemaSee isOpen={isOpen} closeModal={() => setIsOpen(false)} schema={schema} />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center gap-20 items-center">
                    <h1 className="text-3xl font-bold text-purple-800">Crear Clases</h1>
                    <Link href="/design-course">
                        <p className="text-purple-600 hover:text-purple-800 cursor-pointer">← Volver a diseñar tu curso</p>
                    </Link>
                </div>
            </header>
            <div className='flex items-center justify-center'>
                {!courseData1.tema && <h2 className="mt-10 text-3xl font-bold text-purple-800">Debes diseñar tu curso antes de crear las clases</h2>}
            </div>
            <div>
                {courseData1.tema && courseData1.schema &&
                    <CreateClass
                        classesData={classesData}
                        courseData1={courseData1}
                        setIsOpen={setIsOpen}
                        session={session}
                        courseData={courseData}
                        setCourseData={setCourseData}
                        classes={classes}
                        setClasses={setClasses}
                        currentClass={currentClass}
                        setCurrentClass={setCurrentClass}
                        editableScript={editableScript}
                        setEditableScript={setEditableScript}
                    />

                }

            </div>
        </div>
    )
}