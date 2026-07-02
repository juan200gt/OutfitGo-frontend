# OutfitGo Frontend

OutfitGo es una plataforma premium de e-commerce enfocada en la venta de ropa y accesorios. Este repositorio contiene el código del frontend, construido con Angular y estilizado con Tailwind CSS para ofrecer una experiencia de usuario moderna, dinámica y altamente responsiva.

## 🛠️ Acerca de este Fork

He hecho un fork de este proyecto original para arreglar cosas que vea oportunas, depurar errores y prepararlo para poder desplegarlo de forma óptima.

## ⚠️ Funciones no disponibles

Actualmente, el flujo principal de la aplicación (catálogo, carrito y checkout seguro) funciona perfectamente. Sin embargo, hay algunas consideraciones a tener en cuenta:

- **Asistente de IA:** La funcionalidad del asistente virtual de Inteligencia Artificial (Outfit Wizard) **tampoco va** en este despliegue por un problema de configuración/caducidad de las claves de la API.
- **Sistema de Correos:** Básicamente **no funciona el tema de los correos** electrónicos (verificaciones de cuenta, correos de confirmación de pedidos, etc.). No obstante, la página funciona perfectamente sin el correo, ya que el registro se auto-verifica al instante y el checkout/pago se procesa con éxito de forma resiliente.
- **Panel de Administración:** Hay un **sistema completo de gestión de usuarios y artículos** integrado en la aplicación, pero **no voy a dejar acceder** al mismo en esta versión desplegada. Y creo que nada más.

## 🚀 Desarrollo Local

Para ejecutar este frontend en un entorno local:

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Arranca el servidor de desarrollo:
   ```bash
   ng serve
   ```

La aplicación estará disponible en `http://localhost:4200/`.

## 🧪 Guía de Pruebas en Producción

Para probar el flujo completo de la aplicación en producción, puedes seguir estos pasos:

1. Accede a la URL pública: [https://juan200gt.github.io/OutfitGo-frontend/](https://juan200gt.github.io/OutfitGo-frontend/)
2. Añade uno o más productos al carrito desde la tienda.
3. Ve a tu carrito y haz clic en **Proceder al pago**.
4. Se te pedirá iniciar sesión. Haz clic en registrarse y crea una cuenta nueva, o introduce tus credenciales si ya tienes una.
5. Tras iniciar sesión o registrarte con éxito, comprueba que eres **redirigido automáticamente de vuelta al carrito** donde estabas.
6. Haz clic de nuevo en **Proceder al pago**.
7. Selecciona o añade una dirección de envío.
8. Si lo deseas, aplica el cupón de descuento de prueba `BIENVENIDA10` en la casilla correspondiente para ver cómo se aplica el descuento al total del carrito y de la sesión de pago.
9. Haz clic en **Pagar de Forma Segura** para ir a la pasarela de Stripe. Utiliza la tarjeta de pruebas oficial:
   * **Número de tarjeta:** `4242 4242 4242 4242`
   * **Fecha de expiración:** `12/29` (o cualquier fecha futura)
   * **CVC:** `123`
   * **Nombre:** Cualquiera
10. Una vez realizado el pago, Stripe te redirigirá a la página de **Compra Exitosa** (`checkout/success`).
11. Haz clic en tu icono de perfil y accede a **Mis Pedidos**.
12. Allí podrás ver el estado de tu pedido y el **seguimiento mockeado** (simulado), que se actualiza automáticamente cada 15 segundos simulando el proceso de envío en tiempo real.
13. Adicionalmente, puedes probar la funcionalidad de la **Lista de Favoritos** haciendo clic en los corazones de los productos.

*Nota:* La rama de producción del proyecto es `main`. Actualmente, el servicio de correos está temporalmente fuera de servicio, pero será arreglado en el futuro para que la plataforma esté al 100% de su capacidad operativa.
