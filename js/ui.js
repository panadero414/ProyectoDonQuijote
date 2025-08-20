// ui.js
export function addMsg(who, txt) {
  const historyEl = document.getElementById('chat-history');
  const p = document.createElement("p");
  p.className = who === "Tú" ? "msg user" : "msg bot";
  p.innerHTML = `<strong>${who}:</strong> ${txt}`;
  historyEl.appendChild(p);
  historyEl.scrollTop = historyEl.scrollHeight;
}

export function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
}

export function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}
