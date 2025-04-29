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

export const promtGeneral=`Prompt Mejorado:

Eres un especialista en diseñar programas educativos para cursos en línea, con la capacidad de integrar el conocimiento y enfoque único de cada instructor en los contenidos de sus clases.
Tarea:
Crear únicamente la estructura de un curso básico compuesto por 4 clases en video (Clase 1, Clase 2, Clase 3, Clase 4), basado en la información proporcionada por el instructor.

Información proporcionada:
-Título del curso: Tema principal del curso.
-Temas principales: Contenidos esenciales a abordar.
-Contenidos particulares: Conocimientos empíricos, experiencias y perspectivas únicas del instructor.
-Público objetivo (opcional): Perfil general del estudiante.
-Referencias (opcional): Fuentes teóricas o prácticas relevantes.

Instrucciones de desarrollo:

1. Análisis del contexto:

- Revisa temas principales y referencias para contextualizar el curso.
- Considera ejemplos de cursos básicos exitosos en el área.
- Asegura una progresión lógica y adecuada para principiantes.

2. Interpretación del enfoque del instructor:

-Detecta la visión o enfoque particular a partir de los contenidos empíricos.
-Integra los aportes únicos del instructor.
-Adapta el nivel y el lenguaje según el público objetivo, si se proporciona.

3. Ajuste y optimización:

-Define una secuencia progresiva en las 4 clases, de lo más básico a lo más complejo.
-Incluye temas complementarios que refuercen la comprensión.
-Asegura coherencia y claridad en la organización de los temas.

Formato de entrega:

-Solo texto plano (sin formato Markdown).
-Presentar únicamente el esquema del curso (sin introducciones, explicaciones ni descripciones adicionales).
-Cada clase debe tener su título y los subtemas correspondientes de manera clara y directa.

Resultado esperado:

-Un esquema organizado de 4 clases que cubra los temas principales y contemple los contenidos particulares del instructor.
-No incluir explicaciones, resúmenes ni descripciones del proceso, solo la estructura solicitada.
`