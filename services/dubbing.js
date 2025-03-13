/**
 * Servicio para gestionar solicitudes de doblaje de videos
 * @param {Object} dubbingData - Datos para el doblaje
 * @param {string} dubbingData.name - Nombre del proyecto de doblaje
 * @param {string} dubbingData.email - Email del usuario
 * @param {string} dubbingData.sourceLang - Idioma de origen
 * @param {string} dubbingData.targetLang - Idioma de destino
 * @param {number} dubbingData.numSpeakers - Número de oradores
 * @param {File|null} dubbingData.videoFile - Archivo de video (opcional)
 * @param {string|null} dubbingData.videoUrl - URL del video (opcional)
 * @returns {Promise<{success: boolean, dubbing_id: string|null, error: string|null}>} - Resultado de la operación
 */
export const submitDubbingRequest = async (dubbingData) => {
    const { name, email, sourceLang, targetLang, numSpeakers, videoFile, videoUrl } = dubbingData;
    
    // Validación básica
    if (!name || !targetLang || !numSpeakers) {
      return {
        success: false,
        dubbing_id: null,
        error: "Faltan campos requeridos"
      };
    }
    
    // Validar que tengamos al menos un tipo de entrada de video
    if (!videoFile && !videoUrl) {
      return {
        success: false,
        dubbing_id: null,
        error: "Se requiere un archivo de video o una URL"
      };
    }
    
    // Validar URL si se proporciona
    if (videoUrl) {
      if (!videoUrl.startsWith("https://")) {
        return {
          success: false,
          dubbing_id: null,
          error: "La URL debe ser segura (HTTPS)"
        };
      }
      
      const unsafeDomains = ["example.com", "malware-site.com", "phishing-site.net"];
      try {
        const domain = new URL(videoUrl).hostname;
        if (unsafeDomains.includes(domain)) {
          return {
            success: false,
            dubbing_id: null,
            error: "La URL no es segura"
          };
        }
      } catch (error) {
        return {
          success: false,
          dubbing_id: null,
          error: "La URL no es válida"
        };
      }
    }
    
    try {
      let response;
      
      // Enviar petición según el tipo de entrada (archivo o URL)
      if (videoFile) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('videoFile', videoFile);
        formData.append('sourceLang', sourceLang);
        formData.append('targetLang', targetLang);
        formData.append('numSpeakers', numSpeakers);
        
        response = await fetch('/api/dubbing/dubbing', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/dubbing/dubbing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            videoUrl: videoUrl,
            sourceLang: sourceLang,
            targetLang: targetLang,
            numSpeakers: numSpeakers,
          }),
        });
      }
      
      // Procesar respuesta
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          dubbing_id: data.dubbing_id,
          error: null
        };
      } else {
        return {
          success: false,
          dubbing_id: null,
          error: "Error en la respuesta del servidor"
        };
      }
    } catch (error) {
      console.error('Error al iniciar el doblaje:', error);
      return {
        success: false,
        dubbing_id: null,
        error: "Hubo un error al procesar la solicitud de doblaje"
      };
    }
  };