const VAPID_PUBLIC_KEY = 'BKsTf1wxQNiM0tlZUpgzbxoPP-C3phHxs4wEKs7MgK-XJ1vp37vl3YWUNewnNjvTS7I-pHIrGUna2TVpWXmCwpM';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// Referencias de jQuery
var titulo = $('#titulo');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn = $('#post-btn');
var avatarSel = $('#seleccion');
var timeline = $('#timeline');

var modal = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns = $('.seleccion-avatar');
var txtMensaje = $('#txtMensaje');
var notifBtn = $('#notif-btn');

// El usuario, contiene el ID del héroe seleccionado
var usuario;

// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {
    var content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();
}

// Globals
function logIn(ingreso) {
    if (ingreso) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        notifBtn.removeClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');
        notifBtn.addClass('oculto');
        titulo.text('Seleccione Personaje');
    }
}

// Seleccion de personaje
avatarBtns.on('click', function () {
    usuario = $(this).data('user');
    titulo.text('@' + usuario);
    logIn(true);
});

// Boton de salir
salirBtn.on('click', function () {
    logIn(false);
});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {
    modal.removeClass('oculto');
    modal.animate({
        marginTop: '-=1000px',
        opacity: 1
    }, 200);
});

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
    modal.animate({
        marginTop: '+=1000px',
        opacity: 0
    }, 200, function () {
        modal.addClass('oculto');
        txtMensaje.val('');
    });
});

// Boton de enviar mensaje
// Botón de enviar mensaje
postBtn.on('click', async function () {
    var mensaje = txtMensaje.val();

    if (mensaje.length === 0) {
        cancelarBtn.click();
        return;
    }

    crearMensajeHTML(mensaje, usuario);

    try {
        const response = await fetch('http://localhost:3000/api/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: '@' + usuario,
                body: mensaje
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        console.log('Notificación enviada:', data);

    } catch (error) {
        console.error('Error en la petición:', error);
    }
});

// Botón de notificaciones
notifBtn.on('click', async function () {
    if (!('Notification' in window) || !('PushManager' in window)) {
        console.log('Este navegador no soporta notificaciones push');
        return;
    }

    try {
        var permiso = await Notification.requestPermission();
        if (permiso !== 'granted') return; // Si no acepta cancela todo

        var registro = await navigator.serviceWorker.ready;

        var sub = await registro.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        console.log(JSON.stringify(sub));

        var response = await fetch('http://localhost:3000/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sub)
        });

        console.log(response);
    } catch (error) {
        console.error('Error al suscribir a notificaciones:', error);
    }
});

// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js')
            .catch(function (err) {
                console.log('Error al registrar el SW:', err);
            });
    });
}