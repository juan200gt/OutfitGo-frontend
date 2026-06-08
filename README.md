# 🚀 E-Commerce Frontend v2.0 | OutfitGo

![Angular](https://img.shields.io/badge/Angular_19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

Este repositorio contiene el código de la interfaz de usuario oficial de **OutfitGo**, un E-Commerce de moda moderno construido en Angular 19 y TypeScript, dockerizado y optimizado para integrarse directamente con el *Core Engine Backend API*.

---

## 📚 Índice de Documentación Consolidada

Para consultar guías detalladas específicas de la interfaz, accede a los siguientes documentos unificados:

1.  👉 **[Guía de Desarrollo de Interfaz (Angular)](file:///d:/Mis%20Datos/Documentos/GitHub/Frontend/docs/DEVELOPMENT_GUIDE.md)**: Detalle técnico de la arquitectura Standalone, manejo de estado reactivo con Signals y RxJS, configuración de rutas y guards de seguridad, multiidioma (ngx-translate), simulador visual de pedidos y panel del chat Outfit Wizard.
2.  👉 **[Guía de Operaciones y Despliegue (DevOps)](file:///d:/Mis%20Datos/Documentos/GitHub/Frontend/docs/DEPLOYMENT_GUIDE.md)**: Configuración de contenedores Docker (desarrollo y producción), proxy inverso en Nginx local, pipeline automatizado de CI/CD en GitHub Actions y transición futura al balanceador de carga multi-instancia.

---

## ⚠️ Reglas Core de Negocio (Consumo de la API V2)

Para interactuar con el catálogo de ropa de la forma esperada y evitar fallos visuales en el diseño, la UI **debe** acatar estrictamente estas normas:

1.  **Procedencia de Textos**: Todas las descripciones mostradas en las tarjetas y detalles de producto provienen de la lectura directa del campo `descripcion` devuelto por el Backend. No se permite mocking de producto en vistas de producción.
2.  **Longitud de Descripciones**: El Backend garantiza que toda descripción posee una longitud estricta de entre **300 y 500 caracteres**. Debes diseñar y maquetar los componentes previendo estos bloques extensos (mediante truncados CSS, `line-clamp` o paneles expansibles de "Leer Más").

---

## 🐳 Despliegue Local con Docker

El proyecto está preconfigurado para ejecutarse dentro de un contenedor Docker, asegurando que cuentas con el entorno idéntico (Node 22 y Angular CLI 19) sin necesidad de instalar dependencias locales en tu máquina:

1.  **Levantar el contenedor en segundo plano**:
    ```bash
    docker-compose up -d
    ```
2.  **Acceder a la terminal del contenedor e instalar paquetes**:
    ```bash
    docker-compose exec frontend bash
    npm install
    ```
3.  **Arrancar el servidor de desarrollo en Docker**:
    Dentro de la terminal del contenedor, ejecuta el alias rápido para arrancar Angular con recarga automática:
    ```bash
    ng-serve
    ```
    *(Alternativa: `ng serve --host 0.0.0.0 --poll 2000`)*
    Visita `http://localhost:4200/` en tu navegador.

---

## 🛠️ Comandos de Angular CLI (Sin Docker)

Si prefieres usar Node y Angular instalados directamente en tu propio sistema operativo:

*   **Instalar dependencias**: `npm install`
*   **Servidor de desarrollo**: `ng serve` (Visita `http://localhost:4200/`)
*   **Compilar para producción**: `ng build` (Genera los archivos estáticos listos dentro de `dist/outfit-go-angular19/`).
