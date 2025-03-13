/**
 * Servicio para gestionar voces clonadas
 */

/**
 * Obtiene las voces clonadas del usuario
 * @param {string} email - Email del usuario
 * @returns {Promise<{success: boolean, voices: Array|null, error: string|null}>} - Resultado de la operación
 */
export const getVoices = async (email) => {
    if (!email) {
      return {
        success: false,
        voices: null,
        error: "Se requiere email de usuario"
      };
    }
  
    try {
      const res = await fetch(`/api/voices/get-voices?email=${email}`);
      
      if (res.ok) {
        const data = await res.json();

        sessionStorage.setItem("voicesi", JSON.stringify(data.voices));
        
        return {
          success: true,
          voices: data.voices,
          error: null
        };
      } else {
        return {
          success: false,
          voices: null,
          error: "Error al cargar las voces"
        };
      }
    } catch (error) {
      console.error("Error fetching voices:", error);
      return {
        success: false,
        voices: null,
        error: "Error al conectar con el servidor"
      };
    }
  };
  
  /**
   * Clona una voz a partir de un archivo de audio
   * @param {Object} voiceData - Datos para la clonación de voz
   * @param {File} voiceData.audioFile - Archivo de audio para la clonación
   * @param {string} voiceData.name - Nombre para la voz clonada
   * @param {string} voiceData.email - Email del usuario
   * @param {string} voiceData.description - Descripción de la voz (opcional)
   * @param {string} voiceData.noise - Nivel de ruido (opcional)
   * @param {number} voiceData.amountMaxVoices - Límite máximo de voces según plan
   * @param {number} voiceData.amountVoicesClo - Cantidad actual de voces clonadas
   * @returns {Promise<{success: boolean, error: string|null}>} - Resultado de la operación
   */
  export const cloneVoice = async (voiceData) => {
    const { 
      audioFile, 
      name, 
      email, 
      description = "", 
      noise = "low", 
      amountMaxVoices, 
      amountVoicesClo 
    } = voiceData;
  
    // Validaciones básicas
    if (!audioFile || !name) {
      return {
        success: false,
        error: "Rellene los campos obligatorios!"
      };
    }
  
    if (amountVoicesClo >= amountMaxVoices) {
      return {
        success: false,
        error: "Límite de clonación alcanzado, aumente su plan para más clonaciones"
      };
    }
  
    // Preparar datos para el envío
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("name", name);
    formData.append("noise", noise);
    formData.append("description", description);
    formData.append("amountMaxVoices", amountMaxVoices);
    formData.append("amountVoicesClo", amountVoicesClo);
    formData.append("email", email);
  
    try {
      const result = await fetch(`/api/voice-clone/upload-audio`, {
        method: "POST",
        body: formData,
      });
  
      if (result.status === 200) {
        // Eliminamos el cache para forzar una recarga en el próximo getVoices
        sessionStorage.removeItem("voicesi");
        return {
          success: true,
          error: null
        };
      } else {
        return {
          success: false,
          error: "Error al clonar la voz"
        };
      }
    } catch (error) {
      console.error("Error al clonar la voz:", error);
      return {
        success: false,
        error: "Hubo un error al clonar la voz."
      };
    }
  };
  
  /**
   * Elimina una voz clonada
   * @param {Object} voice - Objeto de voz a eliminar
   * @returns {Promise<{success: boolean, updatedVoices: Array|null, error: string|null}>} - Resultado de la operación
   */
  export const deleteVoice = async (voice) => {
    if (!voice || !voice.id) {
      return {
        success: false,
        updatedVoices: null,
        error: "Voz no válida"
      };
    }
  
    try {
      const res = await fetch(`/api/voices/voices?voiceId=${voice.id}`, { 
        method: "DELETE" 
      });
  
      if (res.ok) {
        // Obtenemos las voces actuales del sessionStorage
        const currentVoices = JSON.parse(sessionStorage.getItem("voicesi") || "[]");
        // Filtramos la voz eliminada
        const updatedVoices = currentVoices.filter(v => v.id !== voice.id);
        // Actualizamos el sessionStorage
        sessionStorage.setItem("voicesi", JSON.stringify(updatedVoices));
  
        return {
          success: true,
          updatedVoices,
          error: null
        };
      } else {
        return {
          success: false,
          updatedVoices: null,
          error: "Error al borrar la voz"
        };
      }
    } catch (error) {
      console.error("Error eliminando voz:", error);
      return {
        success: false,
        updatedVoices: null,
        error: "Error al conectar con el servidor"
      };
    }
  };