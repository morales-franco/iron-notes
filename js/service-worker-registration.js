// Registro Service Worker
//URL PROD: https://morales-franco.github.io/iron-notes/index.html
var url = window.location.href;
var swLocation = "/iron-notes/service-worker.js"; //Production

if (url.includes("localhost")) {
  swLocation = "/service-worker.js";
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(swLocation)
    .then(registration => console.log("Registered:", registration))
    .catch(error => console.log("Registration failed: ", error));
}
