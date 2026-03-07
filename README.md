# 🚀 E-Commerce Frontend v2.0 | OutfitGo

![Angular](https://img.shields.io/badge/Angular_19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

Este repositorio contiene la interfaz de usuario oficial de **OutfitGo**, un E-Commerce de moda construido usando [Angular CLI](https://github.com/angular/angular-cli) versión 19. Está optimizado para integrarse directamente con el *Core Engine Backend API*.

---

## ⚠️ Reglas Core de Negocio (Consumo de la API V2)

Para interactuar con el catálogo de ropa de la forma esperada y no romper el diseño, la UI **DEBE** acatar estas normas:

1. **Procedencia Estricta de Textos**: Absolutamente todas las descripciones mostradas en las tarjetas y detalles de producto provienen de la lectura directa del campo `descripcion` devuelto por el Backend.
2. **Longitud Controlada Asegurada**: El Backend garantiza desde base de datos que **toda descripción siempre posee una longitud estricta de entre 300 y 500 caracteres**. 
   * Debes maquetar y diseñar los componentes previendo siempre estos textos extensos.
   * Si una tarjeta (*Card*) de producto tiene una altura estricta, debes implementar restricciones UI, como por ejemplo la utilidad CSS (`text-truncate`), un `line-clamp` para cortar visualmente a 3 líneas, o un panel expansible de "Leer Más".

---

## 🐳 Despliegue Local con Docker

El proyecto está configurado para ejecutarse fácilmente dentro de un contenedor Docker, asegurando que cuentas con el entorno correcto (Node 22 y Angular CLI 19) sin necesidad de instalar dependencias en tu máquina local.

### Comandos de Arranque Rápidos:

1. **Levantar el contenedor en segundo plano:**
   ```bash
   docker-compose up -d
   ```

2. **Acceder a la terminal del contenedor e instalar paquetes:**
   ```bash
   docker-compose exec frontend bash
   npm install
   ```

3. **Arrancar el servidor de desarrollo en Docker:**
   Dentro del contenedor, tenemos un comando rápido (alias) que arranca Angular expuesto a tu máquina y con recarga automática:
   ```bash
   ng-serve
   ```
   *(Alternativa: `ng serve --host 0.0.0.0 --poll 2000`)*

Una vez arrancado, abre tu navegador y visita `http://localhost:4200/`.

---

## 🛠️ Comandos de Angular CLI (Sin Docker)

Si prefieres usar Node y Angular instalados directamente en tu propia máquina (Windows/Mac/Linux):

* **Servidor de Desarrollo**: `ng serve` (Visita `http://localhost:4200/`)
* **Compilar Proyecto**: `ng build`

El comando de compilación generará los archivos de producción estáticos dentro de la carpeta: 👉 **`dist/outfit-go-angular19/`**.

---

## 🚀 Despliegue Automatizado (CI/CD) en AWS

Este frontend cuenta con un pipeline integrado de CI/CD mediante **GitHub Actions**.
Cada vez que se realiza un envío de código (`push`) a la rama `main`, la aplicación se auto-compilará para producción y subirá el empaquetado resultante a nuestra instancia segura de Amazon EC2 ubicada en `/var/www/html/frontend`.
