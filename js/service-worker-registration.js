if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(registration =>console.log('Registered:', registration))
    .catch(error => console.log('Registration failed: ', error));
}