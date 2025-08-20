// recognition.js
import { addMsg, showSpinner, hideSpinner } from './ui.js';
import { speak } from './tts.js';

window.addEventListener('DOMContentLoaded', () => {
  let modoPregunta = false;
  let preguntaPendiente = "";

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return console.error('Web Speech API no soportado');

  const recog = new SR();
  recog.lang = 'es-MX';
  recog.interimResults = false;
  recog.continuous = true;

  recog.onresult = async evt => {
    const text = evt.results[evt.results.length-1][0].transcript.trim().toLowerCase();
    console.log('[Voz]', text);

    if (!modoPregunta && text.includes("oye don quijote")) {
      addMsg('Tú', text);
      preguntaPendiente = "";
      modoPregunta = true;
      speak("Sí, dime");
      return;
    }

    if (modoPregunta && !preguntaPendiente && !text.includes("responde ahora quijote")) {
      preguntaPendiente = text;
      addMsg('Tú', preguntaPendiente);
      speak("Para responderte di, Responde ahora Quijote.");
      return;
    }

    if (modoPregunta && preguntaPendiente && text.includes("responde ahora quijote")) {
      showSpinner();
      modoPregunta = false;
      try {
        const r = await fetch("proxy.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pregunta: preguntaPendiente })
        });
        const data = await r.json();
        const respuesta = data.respuesta || "No entendí tu pregunta.";
        addMsg("Quijote", respuesta);
        speak(respuesta);
      } catch (err) {
        console.error("Error IA:", err);
        addMsg("Error", "Fallo al contactar con Don Quijote.");
      } finally {
        hideSpinner();
        preguntaPendiente = "";
      }
    }
  };

  recog.onend = () => recog.start();
  recog.onerror = e => console.error("Reconocimiento error:", e.error);
  recog.start();
});
