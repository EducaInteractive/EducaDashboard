import { ElevenLabsClient } from "elevenlabs";
const client = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LAB_API_KEY
});

export default async function uploadText(req, res) {
  try {
    const { text, voice, stability, similarity_boost, style_weight } = req.body;

    if(!text||!voice)return res.status(400).json({error:"Faltan datos"})

    const audio = await client.textToSpeech.convert(voice, {
      output_format: "mp3_44100_128",
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: stability,
        similarity_boost: similarity_boost,
        style: style_weight
      }
    });

    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);


    const audioBase64 = audioBuffer.toString('base64');

    return res.json({
      success: true,
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
      audioBuffer: audioBase64
    });
  } catch (error) {
    console.error('Error al generar el audio:', error);
    return res.status(500).json({ error: 'Error al generar el audio' });
  }
}