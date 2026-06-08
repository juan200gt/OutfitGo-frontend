# 🎨 Guía de Desarrollo del Frontend (Angular)

Esta guía técnica está dirigida a los desarrolladores del Frontend de **OutfitGo**. En ella se detalla la arquitectura de la aplicación en Angular 19, el flujo de datos reactivo, el sistema de ruteo, la internacionalización y la lógica detrás de los componentes especiales como el simulador de pedidos y el asistente virtual con IA.

---

## 🏗️ 1. Arquitectura del Proyecto

El proyecto está diseñado bajo una arquitectura modular basada en **Componentes Standalone** (introducidos a partir de Angular 17+ y consolidados en Angular 19). Esto elimina la necesidad de declarar módulos tradicionales de Angular (`@NgModule`), haciendo que cada componente sea autónomo, más fácil de testear y optimice la carga perezosa (*lazy loading*).

### Estructura de Directorios Principal
Ubicación: `src/app/`

*   `components/`: Componentes UI reutilizables (ej. tarjetas de productos, formularios específicos, cabeceras).
*   `pages/`: Componentes de página completa que corresponden a las vistas enrutadas del sitio.
*   `services/`: Lógica de comunicación con el backend (peticiones HTTP) y compartición de estado global.
*   `guards/`: Filtros de seguridad para denegar o permitir el acceso a rutas según el estado de la sesión.
*   `interceptors/`: Clases de manipulación de peticiones salientes (ej. inyección del token de autorización).
*   `interfaces/`: Modelos de datos y contratos TypeScript para tipar respuestas de la API.

---

## ⚡ 2. Gestión de Estado y Reactividad

OutfitGo combina dos patrones de programación reactiva para optimizar el rendimiento y simplificar el código:

1.  **Signals (Reactividad Fina)**:
    *   Utilizado para gestionar el estado síncrono del lado del cliente que afecta directamente a la UI (ej. abrir/cerrar un carrito de compras, listado de productos favoritos, la sesión de usuario activa).
    *   Permite a Angular actualizar de forma ultra eficiente únicamente la porción exacta del DOM que cambia, sin revisar todo el árbol de componentes.
2.  **RxJS (Flujos Asíncronos)**:
    *   Utilizado principalmente en los **Servicios** para manejar peticiones HTTP, eventos asíncronos complejos y transformar las respuestas del Backend mediante operadores (`map`, `catchError`, `tap`, etc.).

---

## 🛡️ 3. Rutas y Guardas de Seguridad

Las rutas se configuran en `src/app/app.routes.ts`. La seguridad para restringir el acceso a usuarios no autorizados o redirigir a los ya autenticados se implementa mediante **Guards** funcionales:

*   **`authGuard`** (`src/app/guards/auth.guard.ts`):
    *   Protege las vistas privadas como la pantalla de compra (`/checkout`), el historial de pedidos (`/profile`) o el carrito.
    *   Si el usuario no está logueado (verificado a través de `AuthService`), le bloquea el acceso y lo redirige automáticamente a `/login`.
*   **`guestGuard`** (`src/app/guards/guest.guard.ts`):
    *   Previene que usuarios que ya han iniciado sesión accedan a las páginas de Login (`/login`) o Registro (`/register`), redirigiéndolos de inmediato a la página de inicio `/home`.

---

## 🌐 4. Internacionalización (ngx-translate)

La aplicación soporta multiidioma dinámico. Las claves de traducción se definen en archivos JSON dentro de la carpeta pública de assets:
*   `public/assets/i18n/es.json` (Español)
*   `public/assets/i18n/fr.json` (Francés)
*   *Configuración*: `ngx-translate` carga estos archivos dinámicamente según la preferencia del usuario en el navegador o su selección manual en la cabecera.

---

## ⚙️ 5. Servicios e Inyección de Autenticación

Todas las llamadas al backend se centralizan en los servicios dentro de `src/app/services/`.
*   **`AuthService`**: Almacena el token y los datos de usuario en `localStorage` tras un login exitoso.
*   **`AuthInterceptor`** (`src/app/interceptors/auth.interceptor.ts`):
    *   Es un interceptor HTTP funcional que escucha todas las peticiones salientes.
    *   Si detecta que el usuario tiene un token activo en `localStorage`, **inyecta automáticamente** la cabecera `Authorization: Bearer {token}` en la petición antes de enviarla al servidor.

---

## 🧙‍♂️ 6. Lógica Especial de Funcionalidades Avanzadas

### 6.1 Simulador de Envío Temporal (`HistorialPedidosComponent`)
Para simular el avance de un pedido en tiempo real sin obligar al usuario a recargar la página:
1.  Al cargar los pedidos del backend, calculamos la diferencia de tiempo entre la última actualización del pedido (`updated_at`) y la hora actual del navegador.
2.  El backend actualiza de forma segura el estado del pedido basándose en el tiempo transcurrido (de `pagado` a `entregando` en +10s, y a `entregado` en +15s).
3.  En Angular, implementamos temporizadores (`setTimeout` de JavaScript) utilizando la diferencia calculada.
4.  Cuando expiran los 10 y 15 segundos correspondientes desde la creación de la compra, actualizamos la propiedad visual del pedido de forma inmediata en la UI, simulando la transición de estados en vivo.

### 6.2 Flujo de Confirmación de Pago (`CheckoutSuccessPageComponent`)
Debido a la integración de Stripe Checkout en 2 pasos:
1.  Stripe devuelve al usuario a la URL de Angular `/checkout/success?session_id=cs_test_...`.
2.  El componente lee el parámetro de la URL `session_id` usando `ActivatedRoute`.
3.  Muestra una pantalla intermedia de "Cargando/Procesando Pago" con un spinner.
4.  Envía el `session_id` mediante una petición `POST` al endpoint `/api/checkout/confirmar`.
5.  Solo cuando el servidor valida el pago y responde con éxito (`200 OK`), se detiene el spinner y se muestra la pantalla de éxito con el resumen del pedido.

### 6.3 Asistente Virtual con IA (`OutfitWizardPageComponent`)
La página del *Outfit Wizard* simula un chat interactivo:
1.  El usuario escribe un mensaje (ej: *"Quiero un outfit deportivo para ir al gimnasio"*).
2.  La petición se envía al servicio `OutfitService` el cual llama a la API del backend.
3.  La API responde con un mensaje explicativo y un array de IDs de productos recomendados.
4.  El componente del chat renderiza el texto de la IA y, justo debajo, pinta una cuadrícula con tarjetas interactivas de los productos reales recomendados (`ProductCardComponent`), permitiendo al usuario agregarlos al carrito con un solo clic.
