# Tienda SK - Sistema de Gestión de Inventario

**Tienda SK** es un sistema de gestión de inventario desarrollado con Node.js, Express, y MongoDB. Este sistema permite la gestión eficiente de productos, autenticación de usuarios y manejo de archivos. La interfaz está diseñada para ser responsiva y amigable para dispositivos móviles utilizando TailwindCSS.

## Características

- **Gestión de Productos**: Permite agregar, editar, y eliminar productos con sus respectivas imágenes.
- **Autenticación Segura**: Utiliza JSON Web Tokens (JWT) y bcryptjs para proteger los datos de los usuarios.
- **Manejo de Archivos**: Implementación de multer para la subida y gestión de imágenes de productos.
- **Interfaz Responsiva**: Interfaz de usuario diseñada con TailwindCSS, optimizada para dispositivos móviles y tabletas.
- **Base de Datos NoSQL**: Gestión eficiente de datos mediante MongoDB y Mongoose.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

- **Node.js** (versión 14 o superior)
- **MongoDB** (versión 4.0 o superior)

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tu-usuario/tienda-sk.git
    cd tienda-sk
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Compila los estilos con TailwindCSS:

    ```bash
    npm run build:css
    ```

## Uso

1. Inicia el servidor:

    ```bash
    npm start
    ```

    El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

2. Accede a la aplicación:

    Abre tu navegador y navega a [http://localhost:3000](http://localhost:3000) para ver la aplicación en acción.

## Scripts Disponibles

- `npm run build:css`: Compila los archivos de estilo con TailwindCSS.
- `npm start`: Inicia el servidor en modo de producción.

## Dependencias Principales

- **Express**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenar datos.
- **Mongoose**: ODM para MongoDB.
- **JWT**: Autenticación mediante JSON Web Tokens.
- **Bcryptjs**: Encriptación de contraseñas.
- **Multer**: Middleware para la gestión de archivos.
- **TailwindCSS**: Framework de CSS para diseño responsivo.
