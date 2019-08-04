// Detectar cambios de conexión
window.addEventListener('online', isOnline );
window.addEventListener('offline', isOnline );

function isOnline() {

    if ( navigator.onLine ) {
        // we are online
        mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'OK!'
        });

        $('#message-error-id').addClass("d-none");
    } else{
        // we are offline
        mdtoast('Offline', {
            interaction: true,
            actionText: 'OK',
            type: 'warning'
        });

        $('#message-error-text-id').text("You are OFFLINE. Please connect to the Internet");
        $('#message-error-id').removeClass("d-none");
    }
}

isOnline();

