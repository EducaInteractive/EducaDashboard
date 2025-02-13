"use client";

import React from 'react';
import { Copyright } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex items-center text-gray-600 ">
            <span>©{currentYear} Educa Interactive. Todos los derechos reservados.</span>
          </div>
          
          <div className="text-gray-500 text-sm">
            Transformando la educación a través de la tecnología
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;