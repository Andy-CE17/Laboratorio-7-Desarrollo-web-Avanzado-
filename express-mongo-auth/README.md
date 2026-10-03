# Nexus — Autenticación y autorización

Aplicación web del Laboratorio 7 desarrollada con Express, MongoDB, EJS, JWT y Materialize. Incluye registro, inicio de sesión, autorización por roles, perfil editable y un panel administrativo.

## Ejecución con Docker

```bash
docker compose up --build
```

La aplicación estará disponible en `http://localhost:3000` y MongoDB Compass podrá conectarse a `mongodb://localhost:27018`.

## Cuenta administrativa inicial

- Correo: `admin@example.com`
- Contraseña: `Admin#12345`

Los valores pueden cambiarse en el archivo `.env`. Este archivo está ignorado por Git; `.env.example` sirve como referencia.

## Funciones principales

- Registro con validación de datos y contraseña segura.
- Inicio de sesión con token JWT almacenado en `sessionStorage`.
- Panel y perfil protegido para cada usuario.
- Panel administrativo con búsqueda y detalle de cuentas.
- Control de acceso según los roles `user` y `admin`.
- Páginas personalizadas para los errores 403 y 404.
- Persistencia de usuarios y roles en MongoDB.

La edad no se almacena en MongoDB. El modelo guarda `birthdate` y expone `age` como una propiedad virtual calculada en tiempo real.
