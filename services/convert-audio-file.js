/**
 * Servicio para convertir archivos de audio
 * @param {File} audioFile - El archivo de audio a convertir
 * @returns {Promise<{success: boolean, url: string|null, error: string|null}>} - Resultado de la operación
 */
export const convertAudioFile = async (audioFile) => {
    if (!audioFile) {
      return {
        success: false,
        url: null,
        error: "No se ha proporcionado un archivo"
      };
    }
  
    const formData = new FormData();
    formData.append("file", audioFile);
  
    try {
      const res = await fetch("/api/convert-file", {
        method: "POST",
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          url: data.url,
          error: null
        };
      } else {
        return {
          success: false,
          url: null,
          error: "Error en la respuesta del servidor"
        };
      }
    } catch (error) {
      return {
        success: false,
        url: null,
        error: "Hubo un error al convertir el archivo"
      };
    }
  };