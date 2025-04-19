"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Home, Sparkles, Waves, Users, Languages, ChevronDown, FileArchive,Layers,LucidePencilRuler  } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { useSession } from "next-auth/react";
import { useDisabled } from "@/contexts/DisabledContext";
import { useDisabledTour } from '@/contexts/DisabledContext';
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

const SideBar = () => {
  const { disabled } = useDisabled();
  const { disabledTour, setDisabledTour } = useDisabledTour();
  const [isOpen, setIsOpen] = useState(false);
  const [isElevenLabsOpen, setIsElevenLabsOpen] = useState(false);
  const [isCreateCourse, setIsCreateCourse] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (!disabledTour) return;

    if(window.innerWidth <= 768)setIsOpen(true);
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: "shadow-md bg-white p-4 rounded ml-4 text-center",
        scrollTo: true,
      },
    });

    tour.addStep({
      id: "step-convert-file",
      text: "Aquí puedes convertir archivos con diferentes formatos a MP3.",
      attachTo: { element: "#convert-file", on: "right" },
      buttons: [{ text: "Siguiente", action: tour.next }],
    });

    tour.addStep({
      id: "step-eleven-labs",
      text: "Este es el menú de Eleven Labs, donde puedes acceder a herramientas avanzadas de audio y doblaje.",
      attachTo: { element: "#eleven-labs", on: "right" },
      buttons: [
        {
          text: "Abrir y continuar",
          action: () => {
            setIsElevenLabsOpen(true);
            setTimeout(() => tour.next(), 500);
          },
        },
      ],
    });

    tour.addStep({
      id: "step-text-to-speech",
      text: "Convierte texto en voz con tecnología avanzada.",
      attachTo: { element: "#text-to-speech", on: "right" },
      buttons: [{ text: "Siguiente", action: tour.next }],
    });

    tour.addStep({
      id: "step-voice-clone",
      text: "Clona voces instantáneamente para su uso en proyectos.",
      attachTo: { element: "#instant-voice-clone", on: "right" },
      buttons: [{ text: "Siguiente", action: tour.next }],
    });

    tour.addStep({
      id: "step-dubbing",
      text: "Genera doblajes en diferentes idiomas con IA.",
      attachTo: { element: "#dubbing", on: "right" },
      buttons: [{ text: "Siguiente", action: tour.next }],
    });

    tour.addStep({
      id: "create-course",
      text: "Este es el menú de creacion de cursos.",
      attachTo: { element: "#create-course", on: "right" },
      buttons: [
        {
          text: "Abrir y continuar",
          action: () => {
            setIsCreateCourse(true);
            setTimeout(() => tour.next(), 500);
          },
        },
      ],
    });
    tour.addStep({
      id: "design-course",
      text: "Diseña el esquema de las clases de tu curso",
      attachTo: { element: "#design-course", on: "right" },
      buttons: [{ text: "Finalizar", action: tour.complete }],
    });


    tour.start();
    setDisabledTour(false)
  }, [disabledTour]);

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      link: "/",
      permission: "home-page",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Manage Users",
      link: "/manage-user",
      permission: "manage-users",
    },
    {
      icon: <FileArchive className="w-5 h-5" />,
      label: "Convert File",
      link: "/convert-file",
      permission: "convert-file",
      id: "convert-file",
    },
  ];

  const elevenLabsItems = [
    {
      icon: <Waves className="w-5 h-5" />,
      label: "Text to Speech",
      link: "/text-to-speech",
      permission: "text-to-speech",
      id: "text-to-speech",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: "Instant Voice Clone",
      link: "/instant-voice-clone",
      permission: "instant-voice-clone",
      id: "instant-voice-clone",
    },
    {
      icon: <Languages className="w-5 h-5" />,
      label: "Dubbing",
      link: "/dubbing",
      permission: "dubbing",
      id: "dubbing",
    },
  ];

  const createCourse=[
    {
      icon: <Layers  className="w-5 h-5" />,
      label: "Desing Course",
      link: "/design-course",
      permission: "desing-course",
      id: "design-course",
    },
    {
      icon: <LucidePencilRuler  className="w-5 h-5" />,
      label: "Create Class",
      link: "/create-class",
      permission: "create-class",
      id: "create-class",
    },
  ]

  const hasPermission = (permission) => {
    if (!permission) return true;
    return PERMISSIONS[permission]?.includes(session?.user?.role);
  };

  return (
    <>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-all duration-300 ease-in-out font-mono
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:block
          border-r border-gray-200`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className={`text-xl font-semibold text-gray-800 ${isOpen ? "ml-10" : ""}`}>Dashboard</h1>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems
            .filter((item) => hasPermission(item.permission))
            .map((item, index) => (
              <Link
                href={disabled ? "#" : item.link}
                key={index}
                id={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all
                  ${disabled ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                  ${pathname === item.link && !disabled ? "bg-gray-100 text-gray-900 font-medium" : ""}`}
              >
                {item.icon}
                <span className="text-[18px]">{item.label}</span>
              </Link>
            ))}

          <div className="relative">
            <button
              onClick={() => setIsElevenLabsOpen(!isElevenLabsOpen)}
              id="eleven-labs"
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all
                ${isElevenLabsOpen ? "bg-purple-50 text-purple-600" : "text-gray-700 hover:bg-gray-100"}
                ${disabled ? "cursor-not-allowed text-gray-400" : ""}`}
            >
              <span className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5" />
                <span className="text-[18px]">Eleven Labs</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isElevenLabsOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {isElevenLabsOpen && (
              <div className="mt-1 ml-3 pl-3 border-l-2 border-purple-200">
                {elevenLabsItems
                  .filter((item) => hasPermission(item.permission))
                  .map((item, index) => (
                    <Link
                      href={disabled ? "#" : item.link}
                      key={index}
                      id={item.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all
                        ${disabled ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                        ${pathname === item.link && !disabled ? "bg-gray-100 text-gray-900 font-medium" : ""}`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ))}
              </div>
            )}
          </div>


          <div className="relative">
            <button
              onClick={() => setIsCreateCourse(!isCreateCourse)}
              id="create-course"
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all
                ${isCreateCourse ? "bg-purple-50 text-purple-600" : "text-gray-700 hover:bg-gray-100"}
                ${disabled ? "cursor-not-allowed text-gray-400" : ""}`}
            >
              <span className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5" />
                <span className="text-[18px]">Create Course</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCreateCourse ? "rotate-180" : "rotate-0"}`} />
            </button>

            {isCreateCourse && (
              <div className="mt-1 ml-3 pl-3 border-l-2 border-purple-200">
                {createCourse
                  .filter((item) => hasPermission(item.permission))
                  .map((item, index) => (
                    <Link
                      href={disabled ? "#" : item.link}
                      key={index}
                      id={item.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all
                        ${disabled ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                        ${pathname === item.link && !disabled ? "bg-gray-100 text-gray-900 font-medium" : ""}`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
