const VAPID_PUBLIC_KEY = 'BKsTf1wxQNiM0tlZUpgzbxoPP-C3phHxs4wEKs7MgK-XJ1vp37vl3YWUNewnNjvTS7I-pHIrGUna2TVpWXmCwpM';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);

    return Uint8Array.from(
        [...rawData].map(char => char.charCodeAt(0))
    );
}

// Referencias de jQuery
var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');
var notifBtn    = $('#notif-btn');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

// El usuario contiene el ID del héroe seleccionado
var usuario;


// ==========================================
// Código de la aplicación
// ==========================================

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


// ==========================================
// Login
// ==========================================

function logIn(ingreso) {

    if (ingreso) {

        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');

        avatarSel.addClass('oculto');

        modalAvatar.attr(
            'src',
            'img/avatars/' + usuario + '.jpg'
        );

    } else {

        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');

        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    }
}


// ==========================================
// Selección de personaje
// ==========================================

avatarBtns.on('click', function () {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});


// ==========================================
// Botón de salir
// ==========================================

salirBtn.on('click', function () {

    logIn(false);

});


// ==========================================
// Botón de nuevo mensaje
// ==========================================

nuevoBtn.on('click', function () {

    modal.removeClass('oculto');

    modal.animate({
        marginTop: '-=1000px',
        opacity: 1
    }, 200);

});


// ==========================================
// Botón de cancelar mensaje
// ==========================================

cancelarBtn.on('click', function () {

    modal.animate({
        marginTop: '+=1000px',
        opacity: 0
    }, 200, function () {

        modal.addClass('oculto');

        txtMensaje.val('');

    });

});


// ==========================================
// Botón de enviar mensaje
// ==========================================

postBtn.on('click', function () {

    var mensaje = txtMensaje.val();

    if (mensaje.length === 0) {

        cancelarBtn.click();

        return;
    }

    crearMensajeHTML(mensaje, usuario);

});


// ==========================================
// NOTIFICACIONES PUSH
// ==========================================

notifBtn.on('click', async function () {

    try {

        // Verificar soporte de notificaciones
        if (!('Notification' in window)) {
            alert('Este navegador no soporta notificaciones.');
            return;
        }

        // Solicitar permiso
        var permiso = await Notification.requestPermission();

        if (permiso !== 'granted') {
            console.log('Permiso de notificaciones no concedido.');
            return;
        }

        // Obtener Service Worker
        var registro = await navigator.serviceWorker.getRegistration();

        if (!registro) {
            console.error('No se encontró el Service Worker.');
            return;
        }

        // Suscribirse a Push
        var sub = await registro.pushManager.subscribe({

            userVisibleOnly: true,

            applicationServerKey:
                urlBase64ToUint8Array(VAPID_PUBLIC_KEY)


        });

        console.log(JSON.stringify(sub));
        const response = await fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            body: JSON.stringify(sub),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al enviar la suscripción al servidor');
        }

        console.log('Suscripción enviada al servidor correctamente');

    } catch (error) {

        console.error(
            'Error al configurar las notificaciones:',
            error
        );

    }

});


// ==========================================
// Registro del Service Worker
// ==========================================

if ('serviceWorker' in navigator) {

    window.addEventListener('load', function () {

        navigator.serviceWorker
            .register('sw.js')
            .then(function (registro) {

                console.log(
                    'Service Worker registrado correctamente:',
                    registro
                );

            })
            .catch(function (err) {

                console.log(
                    'Error al registrar el SW:',
                    err
                );

            });

    });

}