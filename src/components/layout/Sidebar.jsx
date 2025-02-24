"use client";

import React, { useState } from "react";
import { Menu, X, Home, Sparkles, Waves, Users, Languages, ChevronDown,FileArchive} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { useSession } from "next-auth/react";
import { useDisabled } from "@/contexts/DisabledContext";

const SideBar = () => {
  const { disabled } = useDisabled();
  const [isOpen, setIsOpen] = useState(false);
  const [isElevenLabsOpen, setIsElevenLabsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: "Home", 
      link: "/",
      permission: 'home-page'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: "Manage Users", 
      link: "/manage-user",
      permission: 'manage-users'
    },
    { 
      icon: <FileArchive className="w-5 h-5" />, 
      label: "Convert File", 
      link: "/convert-file",
      permission: 'convert-file'
    },
  ];

  const elevenLabsItems = [
    { 
      icon: <Waves className="w-5 h-5" />, 
      label: "Text to Speech", 
      link: "/text-to-speech",
      permission: 'text-to-speech'
    },
    { 
      icon: <Sparkles className="w-5 h-5" />, 
      label: "Instant Voice Clone", 
      link: "/instant-voice-clone",
      permission: 'instant-voice-clone'
    },
    { 
      icon: <Languages className="w-5 h-5" />, 
      label: "Dubbing", 
      link: "/dubbing",
      permission: 'dubbing'
    },
  ];

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

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-all duration-300 ease-in-out font-mono
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:block
          border-r border-gray-200`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2 ">
            {menuItems.filter(item => hasPermission(item.permission)).map((item, index) => (
              <Link
                href={disabled ? "#" : item.link}
                key={index}
                className={`flex items-center  space-x-3 p-3 rounded-lg transition-all
                  ${disabled ? 
                    "cursor-not-allowed text-gray-400" : 
                    "text-gray-700 hover:bg-gray-100  hover:text-gray-900"
                  } 
                  ${pathname === item.link && !disabled ? 
                    "bg-gray-100 text-gray-900 font-medium" : ""
                  }`}
                onClick={(e) => {
                  if (disabled) e.preventDefault();
                  else setIsOpen(false);
                }}
              >
                {item.icon}
                <span className="text-[18px]">{item.label}</span>
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsElevenLabsOpen(!isElevenLabsOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all
                  ${isElevenLabsOpen ? "bg-purple-50 text-purple-600" : "text-gray-700 hover:bg-gray-100"}
                  ${disabled ? "cursor-not-allowed text-gray-400" : ""}`}
              >
                <span className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[18px]">Eleven Labs</span>
                </span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200
                    ${isElevenLabsOpen ? "rotate-180" : "rotate-0"}`} 
                />
              </button>

              {isElevenLabsOpen && (
                <div className="mt-1 ml-3 pl-3 border-l-2 border-purple-200">
                  {elevenLabsItems.filter(item => hasPermission(item.permission)).map((item, index) => (
                    <Link
                      href={disabled ? "#" : item.link}
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all
                        ${disabled ? 
                          "cursor-not-allowed text-gray-400" : 
                          "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }
                        ${pathname === item.link && !disabled ? 
                          "bg-gray-100 text-gray-900 font-medium" : ""
                        }`}
                      onClick={(e) => {
                        if (disabled) e.preventDefault();
                        else setIsOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
         
        </div>
      </aside>
    </>
  );
};

export default SideBar;