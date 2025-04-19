"use client"

import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { callbackUrl, error: queryError } = router.query;

  useEffect(() => {
    if (queryError) {
      setError("No tienes autorización para acceder a esta plataforma.");
    }
  }, [queryError]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("google", {
        callbackUrl: callbackUrl || "/",
        redirect: false,
      });
      
      if (result?.error) {
        setError("No tienes autorización para acceder a esta plataforma.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Panel izquierdo - Decorativo */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex flex-col justify-between hidden md:flex">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Educa Interactive</h2>
                <p className="text-blue-100 text-xl mb-8">Transformando la educación digital, un curso a la vez</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 text-white">
                  <div className="bg-blue-500 bg-opacity-30 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <p>Plataforma educativa segura</p>
                </div>
                
                <div className="flex items-center space-x-3 text-white">
                  <div className="bg-blue-500 bg-opacity-30 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </div>
                  <p>Contenido de alta calidad</p>
                </div>
                
                <div className="flex items-center space-x-3 text-white">
                  <div className="bg-blue-500 bg-opacity-30 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <p>Acceso 24/7 a tus cursos</p>
                </div>
              </motion.div>
            </div>
            
            <div className="text-sm text-blue-100 mt-12">
              © 2025 Educa Interactive. Todos los derechos reservados.
            </div>
          </div>
          
          {/* Panel derecho - Login */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-10"
            >
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mb-6">
                <Image src="/favicon.webp" alt="Logo" width={80} height={80} className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h1>
              <p className="text-gray-600">
                Accede a tu portal educativo para continuar aprendiendo
              </p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-6"
            >
              <div className="text-center px-6">
                <p className="text-sm text-gray-500 mb-6">
                  Utilizamos inicio de sesión con Google para brindarte una experiencia segura y rápida
                </p>
              </div>

              <button
                onClick={handleLogin}
                className={`w-full py-3.5 px-4 ${
                  isLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50 text-gray-700"
                } font-medium rounded-xl border border-gray-300 shadow-sm transition duration-300 relative flex items-center justify-center`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <img src="/googleIcon.png" alt="Google" className="h-5 w-5" />
                    <span>Continuar con Google</span>
                  </div>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 mt-8">
                <p>
                  ¿Necesitas ayuda? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contacta con soporte</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}