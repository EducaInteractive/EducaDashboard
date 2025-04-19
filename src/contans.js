export const languagesSources = [
    { id: "en", language: "English" },
    { id: "af", language: "Afrikaans" },
    { id: "ar", language: "Arabic" },
    { id: "hy", language: "Armenian" },
    { id: "az", language: "Azerbaijani" },
    { id: "be", language: "Belarusian" },
    { id: "bs", language: "Bosnian" },
    { id: "bg", language: "Bulgarian" },
    { id: "ca", language: "Catalan" },
    { id: "zh", language: "Chinese" },
    { id: "hr", language: "Croatian" },
    { id: "cs", language: "Czech" },
    { id: "da", language: "Danish" },
    { id: "nl", language: "Dutch" },
    { id: "et", language: "Estonian" },
    { id: "fi", language: "Finnish" },
    { id: "fr", language: "French" },
    { id: "gl", language: "Galician" },
    { id: "de", language: "German" },
    { id: "el", language: "Greek" },
    { id: "he", language: "Hebrew" },
    { id: "hi", language: "Hindi" },
    { id: "hu", language: "Hungarian" },
    { id: "is", language: "Icelandic" },
    { id: "id", language: "Indonesian" },
    { id: "it", language: "Italian" },
    { id: "ja", language: "Japanese" },
    { id: "kn", language: "Kannada" },
    { id: "kk", language: "Kazakh" },
    { id: "ko", language: "Korean" },
    { id: "lv", language: "Latvian" },
    { id: "lt", language: "Lithuanian" },
    { id: "mk", language: "Macedonian" },
    { id: "ms", language: "Malay" },
    { id: "mr", language: "Marathi" },
    { id: "mi", language: "Maori" },
    { id: "ne", language: "Nepali" },
    { id: "no", language: "Norwegian" },
    { id: "fa", language: "Persian" },
    { id: "pl", language: "Polish" },
    { id: "pt", language: "Portuguese" },
    { id: "ro", language: "Romanian" },
    { id: "ru", language: "Russian" },
    { id: "sr", language: "Serbian" },
    { id: "sk", language: "Slovak" },
    { id: "es", language: "Spanish" },
    { id: "sw", language: "Swahili" },
    { id: "sv", language: "Swedish" },
    { id: "tl", language: "Tagalog" },
    { id: "ta", language: "Tamil" },
    { id: "th", language: "Thai" },
    { id: "tr", language: "Turkish" },
    { id: "uk", language: "Ukrainian" },
    { id: "ur", language: "Urdu" },
    { id: "vi", language: "Vietnamese" },
    { id: "cy", language: "Welsh" }
];

export const languagesTarget = [
    { id: "en", language: "English" },
    { id: "zh", language: "Chinese" },
    { id: "es", language: "Spanish" },
    { id: "hi", language: "Hindi" },
    { id: "pt", language: "Portuguese" },
    { id: "fr", language: "French" },
    { id: "ja", language: "Japanese" },
    { id: "de", language: "German" },
    { id: "ar", language: "Arabic" },
    { id: "ko", language: "Korean" },
    { id: "ru", language: "Russian" },
    { id: "id", language: "Indonesian" },
    { id: "it", language: "Italian" },
    { id: "nl", language: "Dutch" },
    { id: "tr", language: "Turkish" },
    { id: "pl", language: "Polish" },
    { id: "sv", language: "Swedish" },
    { id: "fi", language: "Finnish" },
    { id: "ms", language: "Malay" },
    { id: "ro", language: "Romanian" },
    { id: "el", language: "Greek" },
    { id: "cs", language: "Czech" },
    { id: "da", language: "Danish" },
    { id: "bg", language: "Bulgarian" },
    { id: "hr", language: "Croatian" },
    { id: "sk", language: "Slovak" },
    { id: "ta", language: "Tamil" }
];

export const prompCreateClass=`#Objetivo:
Eres un educador experto, especializado en diseñar cursos online (MOOCs) efectivos e innovadores.
Tu misión es crear el guión completo de la clase indicada, manteniendo coherencia, consistencia,
precisión académica y calidad pedagógica, alineado con el enfoque del instructor.

#Lógica:
1. Analiza el programa del curso y localiza la clase a desarrollar.
2. Organiza los temas de forma lógica y progresiva.
3. Redacta el guión en secciones:Titulo de la clase(sin "clase:1" solo el titulo), Introducción, Desarrollo de contenidos, conclusion
   Ejemplo(s) aplicado(s), Actividad interactiva (enunciado).

#Reglas:
* Mantente fiel a los temas asignados a la clase.
* Usa vocabulario académico claro, nivel básico.
* Asegura transiciones fluidas y un cierre motivador.
* Responde siempre en formato JSON con las siguientes propiedades: 
{
  "title": string,
  "introduction": string, 
  "development": string, 
  "conclusion": string,
  "activity": string
}
`

export const promtGeneral=`Eres un especialista en diseñar programas educativos para cursos en línea, capaz de integrar el conocimiento y el enfoque único de cada instructor en los contenidos de sus clases.
Tienes la misión de crear la estructura de un curso básico basado en la información proporcionada por el instructor.

Objetivo General:
- Desarrollar un esquema de curso con 4 clases que serán grabadas en video (Clase 1, Clase 2, Clase 3, Clase 4).
- Organizar el contenido de manera clara y coherente, partiendo de un nivel básico.

Información Proporcionada por el Instructor:
- Título del curso: Representa el tema principal.
- Temas principales: Son los contenidos esenciales que el instructor desea abarcar.
- Contenidos particulares: Conocimientos empíricos, experiencias y perspectivas únicas del instructor que se deben integrar.
- Público objetivo (opcional): Perfil general del tipo de estudiante al que va dirigido.
- Referencias (opcional): Literatura, trabajos académicos, estudios científicos o artículos relevantes para el desarrollo de las clases.

Instrucciones de Desarrollo:
1. Análisis del Contexto
   - Revisa los temas principales y las referencias para contextualizar el curso en estándares de calidad.
   - Ten en cuenta modelos de cursos básicos exitosos en la misma área temática.
   - Considera la mejor secuencia de aprendizaje para un estudiante principiante.
2. Interpretación del Enfoque del Instructor
   - Analiza los temas y contenidos particulares para detectar el enfoque o la visión única del instructor.
   - Integra las perspectivas o enfoques personales que le dan valor diferencial al curso.
   - Revisa el público objetivo (si está definido) para adaptar el nivel y el lenguaje.
   - Incluye o relaciona referencias (si se han proporcionado) que fortalezcan la solidez teórica y práctica de los contenidos.
3. Ajuste y Optimización
   - Define una distribución lógica para cada una de las 4 clases, asegurando claridad y progresión para un nivel básico.
   - Incorpora los temas complementarios que sean necesarios para reforzar o enriquecer la comprensión.
   - Asegúrate de que la secuencia de temas en cada clase cumpla con una curva de aprendizaje adecuada, de lo más introductorio a lo más complejo.

Formato y Reglas de Presentación:
- El esquema final debe constar de 4 clases y cubrir todos los temas relevantes.
- Mantén una estructura clara: numera o titula cada clase y sus subtemas.
- El contenido de cada clase debe reflejar los puntos clave (temas principales) y las perspectivas particulares del instructor.
- Redacta cada propuesta de clase de forma breve y directa, cuidando que el enfoque sea básico y entendible.

Resultado Esperado:
- Una propuesta de esquema de 4 clases grabadas, indicando los contenidos principales que se cubrirán en cada una, la secuencia recomendada y cómo se integran las perspectivas únicas del instructor y las referencias cuando apliquen.
`