// ===== Utilidades =====
const $ = (id) => document.getElementById(id);

const CLAVE_PLANES = "entrenos_planes";
const CLAVE_HORA = "entrenos_hora";
const CLAVE_ULTIMO_AVISO = "entrenos_ultimo_aviso";

// ===== Almacenamiento local (funciona sin red) =====
function cargarPlanes() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PLANES)) || [];
  } catch {
    return [];
  }
}

function guardarPlanes(planes) {
  localStorage.setItem(CLAVE_PLANES, JSON.stringify(planes));
}

// ===== Render de la lista =====
function renderPlanes() {
  const lista = $("lista-planes");
  lista.innerHTML = "";
  const planes = cargarPlanes();

  if (planes.length === 0) {
    const vacio = document.createElement("li");
    vacio.textContent = "Aún no tienes planes guardados.";
    lista.appendChild(vacio);
    return;
  }

  planes.forEach((plan) => {
    const li = document.createElement("li");

    const titulo = document.createElement("h3");
    titulo.textContent = plan.nombre;

    const dia = document.createElement("p");
    dia.className = "dia";
    dia.textContent = plan.dia;

    const ul = document.createElement("ul");
    plan.ejercicios.forEach((ej) => {
      const item = document.createElement("li");
      item.textContent = ej;
      ul.appendChild(item);
    });

    const btn = document.createElement("button");
    btn.className = "btn-borrar";
    btn.textContent = "Borrar";
    btn.addEventListener("click", () => borrarPlan(plan.id));

    li.append(titulo, dia, ul, btn);
    lista.appendChild(li);
  });
}

function borrarPlan(id) {
  guardarPlanes(cargarPlanes().filter((p) => p.id !== id));
  renderPlanes();
}

// ===== Formulario =====
$("form-plan").addEventListener("submit", (e) => {
  e.preventDefault();

  const ejercicios = $("ejercicios-plan")
    .value.split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const plan = {
    id: Date.now(),
    nombre: $("nombre-plan").value.trim(),
    dia: $("dia-plan").value.trim(),
    ejercicios,
  };

  const planes = cargarPlanes();
  planes.push(plan);
  guardarPlanes(planes);

  e.target.reset();
  renderPlanes();
});

// ===== Estado de red =====
function actualizarEstadoRed() {
  const badge = $("estado-red");
  const enLinea = navigator.onLine;
  badge.textContent = enLinea ? "En línea" : "Sin conexión";
  badge.classList.toggle("offline", !enLinea);
}
window.addEventListener("online", actualizarEstadoRed);
window.addEventListener("offline", actualizarEstadoRed);

// ===== Service Worker =====
let registroSW = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      registroSW = await navigator.serviceWorker.register("sw.js");
    } catch (err) {
      console.error("No se pudo registrar el service worker:", err);
    }
  });
}

// ===== Instalación =====
let eventoInstalar = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  eventoInstalar = e;
  $("btn-instalar").hidden = false;
});

$("btn-instalar").addEventListener("click", async () => {
  if (!eventoInstalar) return;
  eventoInstalar.prompt();
  await eventoInstalar.userChoice;
  eventoInstalar = null;
  $("btn-instalar").hidden = true;
});

window.addEventListener("appinstalled", () => {
  $("btn-instalar").hidden = true;
});

// ===== Notificaciones (locales) =====
async function mostrarNotificacion() {
  const reg = registroSW || (await navigator.serviceWorker.ready);
  const planes = cargarPlanes();
  const cuerpo = planes.length
    ? `Hoy toca: ${planes[0].nombre}`
    : "Es hora de entrenar. ¡Crea tu plan!";

  reg.showNotification("💪 Hora de entrenar", {
    body: cuerpo,
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    tag: "recordatorio-diario",
  });
}

$("btn-notificaciones").addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("Tu navegador no soporta notificaciones.");
    return;
  }

  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") {
    alert("Permiso de notificaciones denegado.");
    return;
  }

  localStorage.setItem(CLAVE_HORA, $("hora-recordatorio").value);
  $("btn-notificaciones").textContent = "Recordatorio activo ✔";
  mostrarNotificacion(); // prueba inmediata
});

// Revisa cada 30 s si ya llegó la hora (solo con la app abierta)
function revisarRecordatorio() {
  const hora = localStorage.getItem(CLAVE_HORA);
  if (!hora || Notification.permission !== "granted") return;

  const ahora = new Date();
  const actual = ahora.toTimeString().slice(0, 5); // "HH:MM"
  const hoy = ahora.toDateString();

  if (actual === hora && localStorage.getItem(CLAVE_ULTIMO_AVISO) !== hoy) {
    localStorage.setItem(CLAVE_ULTIMO_AVISO, hoy);
    mostrarNotificacion();
  }
}
setInterval(revisarRecordatorio, 30000);

// ===== Inicio =====
(function iniciar() {
  const horaGuardada = localStorage.getItem(CLAVE_HORA);
  if (horaGuardada) $("hora-recordatorio").value = horaGuardada;
  if ("Notification" in window && Notification.permission === "granted" && horaGuardada) {
    $("btn-notificaciones").textContent = "Recordatorio activo ✔";
  }
  actualizarEstadoRed();
  renderPlanes();
})();