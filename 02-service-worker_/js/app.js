// Revisar si puedo usar el Service Worker


// EL service worker se registra en el navegador y se deja al mismo nivel del index 
// debido a que asi puede controlar toda la aplicacion
if (navigator.serviceWorker) {
    console.log('Si se puede usar el Service Worker');

    navigator.serviceWorker.register('./sw.js')
        .catch(error => {
            console.log('No se pudo registrar el Service Worker', error);
        });

        
}

