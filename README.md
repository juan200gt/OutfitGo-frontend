# OutfitGo

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 19.2.21.

## 🚀 Despliegue con Docker

El proyecto está configurado para ejecutarse fácilmente dentro de un contenedor Docker, asegurando que cuentas con el entorno correcto (Node 22 y Angular CLI 19) sin necesidad de instalar nada en tu máquina locał (solamente Docker y Docker Compose).

### Comandos necesarios para arrancar con Docker:

1. **Levantar el contenedor en segundo plano:**
   ```bash
   docker-compose up -d
   ```

2. **Acceder a la terminal del contenedor:**
   ```bash
   docker-compose exec frontend bash
   ```

3. **Instalar las dependencias (dentro del contenedor):**
   ```bash
   npm install
   ```

4. **Arrancar el servidor de desarrollo:**
   Dentro del contenedor, se ha creado un comando rápido (alias) llamado `ng-serve` que arranca Angular expuesto a tu máquina y con recarga automática para los cambios de archivos:
   ```bash
   ng-serve
   ```
   *(También puedes usar el comando completo: `ng serve --host 0.0.0.0 --poll 2000`)*

Una vez arrancado, abre tu navegador y visita `http://localhost:4200/`.

---

## 🛠️ Comandos de Angular CLI

### Servidor de Desarrollo Local (Sin Docker)
Si prefieres usar Node y Angular instalados directamente en tu propia máquina (Windows/Mac/Linux), puedes ejecutar:
```bash
ng serve
```
Luego visita `http://localhost:4200/`.

### Compilar el Proyecto (`ng build`)
Para compilar el proyecto y prepararlo para un entorno real de producción, debes ejecutar el siguiente comando:
```bash
ng build
```

**¿Qué hace y qué carpeta genera `ng build`?**
Angular CLI compilará todo el código TypeScript a JavaScript puro, optimizará los recursos (minificar código, eliminar código muerto o no usado, etc) y **creará los archivos de producción estáticos**.

Todos estos archivos listos para producción se generarán y guardarán dentro de la carpeta:
👉 **`dist/outfit-go-angular19/`**

El contenido de esta carpeta (donde se encontrará el `index.html` resultante junto con sus dependencias `.js` y estilos) es lo que deberás coger y subir a tu servidor de producción final web (por ejemplo: Nginx, Apache, Vercel, Firebase Hosting, Netlify, etc.).
