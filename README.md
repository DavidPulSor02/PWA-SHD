# PWA - Mis Entrenamientos

Aplicación web progresiva (PWA) para gestionar planes de entrenamiento, recordatorios diarios y uso sin conexión.

## Despliegue en GitHub Pages

El workflow publica únicamente el contenido de `SHD` en la raíz de la rama `gh-pages`.

### Requisitos
- Tener un repositorio remoto en GitHub.
- En el repositorio, configura GitHub Pages para publicar desde la rama `gh-pages`, carpeta `/(root)`.

### Publicación
1. Conecta este repositorio a tu remoto de GitHub.
2. Haz push a la rama `main`.
3. En GitHub, ve a `Settings > Pages`.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `gh-pages` y la carpeta `/(root)`, y pulsa **Save**.

Cada push a `main` vuelve a publicar solo `SHD`. La aplicación quedará disponible en:

`https://<usuario>.github.io/<repositorio>/`
