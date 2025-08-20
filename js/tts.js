// tts.js
import { showSpinner, hideSpinner } from './ui.js';

const BASE_URL = "https://donquijote.onrender.com";

export async function speak(text) {
  showSpinner();
  const cleanText = text.replace(/\*/g, '').replace(/_/g, '').replace(/\s{2,}/g, ' ').trim();
  try {
    const res = await fetch(`${BASE_URL}/voz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: cleanText })
    });
    const data = await res.json();
    if (data.audio) {
      const audio = new Audio(`${BASE_URL}${data.audio}?t=${Date.now()}`);
      audio.play();
    } else {
      console.error("Error de voz:", data);
    }
  } catch (err) {
    console.error("Fallo de voz:", err);
  } finally {
    hideSpinner();
  }
}
