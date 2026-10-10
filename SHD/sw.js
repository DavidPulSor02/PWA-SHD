const VERSION = "v2";
const CACHE = `entrenos-${VERSION}`;

const ARCHIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

// ===== Instalación: guarda todo en caché =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// ===== Activación: borra cachés viejas =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(
          claves.filter((c) => c !== CACHE).map((c) => caches.delete(c))
        )
      )
  );
  self.clients.claim();
});

// ===== Fetch: primero caché, luego red =====
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((enCache) => {
      if (enCache) return enCache;

      return fetch(event.request)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copia));
          return respuesta;
        })
        .catch(() => {
          // Sin red y sin caché: si pide una página, devuelve el index
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});

// ===== Clic en la notificación: abre o enfoca la app =====
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((ventanas) => {
        for (const ventana of ventanas) {
          if ("focus" in ventana) return ventana.focus();
        }
        return self.clients.openWindow("./index.html");
      })
  );
});

// ===== Push (para la fase 2, con backend) =====
self.addEventListener("push", (event) => {
  const datos = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(datos.titulo || "💪 Hora de entrenar", {
      body: datos.cuerpo || "Abre tu plan de hoy.",
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
    })
  );
});