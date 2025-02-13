"use client";

import React, { useState } from "react";
import { Menu, X, Home, Sparkles, Waves,Users,Languages  } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { useSession } from "next-auth/react";
import { useDisabled } from "@/contexts/DisabledContext";


const SideBar = ({}) => {
  const { disabled } = useDisabled();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { 
      icon: <Home className="w-6 h-6" />, 
      label: "Home", 
      link: "/",
      permission: 'home-page'
    },
    { 
      icon: <Waves className="w-6 h-6" />, 
      label: "Text to speech", 
      link: "/text-to-speech",
      permission: 'text-to-speech'
    },
    { 
      icon: <Sparkles className="w-6 h-6" />, 
      label: "Instant voice clone", 
      link: "/instant-voice-clone",
      permission: 'instant-voice-clone'
    },
    { 
      icon: <Languages className="w-6 h-6" />, 
      label: "Dubbing", 
      link: "/dubbing",
      permission: 'dubbing'
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      label: "Gestionar Usuarios", 
      link: "/manage-user",
      permission: 'manage-users'
    },
  ];

  const hasPermission = (permission) => {
    if (!permission) return true;
    return PERMISSIONS[permission]?.includes(session?.user?.role);
  };

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission)
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out font-mono ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:block`}
      >
        <div className="flex flex-col p-4 space-y-4 mt-[50px]">

          {filteredMenuItems.map((item, index) => (
            <Link
              href={disabled ? "#" : item.link}
              key={index}
              className={`flex items-center font-mono space-x-2 p-2 rounded-md ${disabled ? "cursor-not-allowed text-gray-400" : "hover:bg-gray-200"
                } ${pathname === item.link && !disabled ? "bg-gray-200" : ""}`}
              onClick={(e) => {
                if (disabled) e.preventDefault();
                else setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </ Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
