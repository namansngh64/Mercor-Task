var socket = io();

const outputUser = document.querySelector(".userText");
const outputChatGPT = document.querySelector(".chatgptText");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

document.querySelector(".myBtn").addEventListener("click", () => {
  recognition.start();
});

recognition.addEventListener("speechstart", () => {
  console.log("Speech has been detected.");
});

recognition.addEventListener("result", (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputUser.textContent = text;
  socket.emit("chat message", text);
});

recognition.addEventListener("speechend", () => {
  recognition.stop();
  setTimeout(() => {
    recognition.start();
  }, 500);
});

recognition.addEventListener("error", (e) => {
  recognition.stop();
  setTimeout(() => {
    recognition.start();
  }, 500);
});

function synthVoice(text) {
  utterance.text = text;
  synth.cancel();
  synth.speak(utterance);
}

socket.on("bot reply", function (replyText) {
  synthVoice(replyText);
  if (replyText == "") replyText = "(No answer...)";
  outputChatGPT.textContent = replyText;
});
