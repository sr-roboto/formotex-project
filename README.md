# Formotex Project

## Descripción

API RESTful desarrollada con Node.js, TypeScript, Express y MongoDB siguiendo
los principios de Clean Architecture. Incluye sistema de autenticación JWT,
gestión de usuarios y panel administrativo con operaciones CRUD completas.

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - JSON Web Tokens para autenticación
- **bcrypt** - Hashing de contraseñas
- **Docker** - Containerización
- **tsx** - TypeScript execution environment

## Arquitectura

El proyecto sigue los principios de **Clean Architecture** con la siguiente
estructura:

```
src/
├── config/           # Configuraciones (JWT, bcrypt, envs)
├── data/             # Conexión a base de datos
├── domain/           # Entidades, DTOs, Use Cases, Interfaces
│   ├── dtos/         # Data Transfer Objects
│   ├── entities/     # Entidades del dominio
│   ├── errors/       # Manejo de errores personalizados
│   ├── repositories/ # Interfaces de repositorios
│   ├── datasources/  # Interfaces de fuentes de datos
│   └── use-cases/    # Casos de uso
├── infrastructure/   # Implementaciones externas
│   ├── datasources/  # Implementación de datasources
│   ├── mappers/      # Mappers entre capas
│   └── repositories/ # Implementación de repositorios
└── presentation/     # Capa de presentación
    ├── auth/         # Controladores y rutas de autenticación
    ├── middlewares/  # Middlewares personalizados
    ├── routes/       # Configuración de rutas
    └── server/       # Configuración del servidor
```

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd formotex-project
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno** Crear archivo `.env` en la raíz del
   proyecto:

```env
PORT=3000
MONGO_DB_NAME=formotex_db
MONGO_DB_USER=formotex_owner
MONGO_DB_PASSWORD=aeUQ4WzteS3ejuNILgtdlZb4FnygQtL8qrZMKSc26XOfvgGuFs
MONGO_DB_URL=mongodb://formotex_owner:aeUQ4WzteS3ejuNILgtdlZb4FnygQtL8qrZMKSc26XOfvgGuFs@localhost:27017/formotex_db?authSource=admin
JWT_SECRET=458c14440172faf7e6485eac2c115c3f0b326120addfb8ca57d26673d93dc44d
```

4. **Levantar la base de datos con Docker**

```bash
docker-compose up -d
```

5. **Ejecutar la aplicación**

```bash
npm run dev
```

## Funcionalidades Implementadas

### 🔐 Sistema de Autenticación

- **Registro de usuarios** con validación de datos
- **Login** con autenticación JWT
- **Hashing de contraseñas** con bcrypt
- **Middleware de autenticación** para rutas protegidas
- **Obtener perfil** de usuario autenticado

### 👥 Gestión de Usuarios (Admin)

- **Listar todos los usuarios**
- **Obtener usuario por ID**
- **Actualizar información de usuario**
- **Eliminar usuario**
- **Middleware de autorización** por roles

### 🛡️ Seguridad

- **JWT Tokens** con expiración configurable
- **Validación de roles** (admin/user)
- **Sanitización de respuestas**
- **Manejo robusto de errores**

## Endpoints API

### Autenticación

```
POST /api/auth/register     # Registrar nuevo usuario
POST /api/auth/login        # Iniciar sesión
GET  /api/auth/profile      # Obtener perfil (requiere token)
```

### Administración (requiere rol admin)

```
GET    /api/auth/users      # Listar todos los usuarios
GET    /api/auth/users/:id  # Obtener usuario específico
PUT    /api/auth/users/:id  # Actualizar usuario
DELETE /api/auth/users/:id  # Eliminar usuario
```

## Uso de la API

### Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Acceder a rutas protegidas

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Modelos de Datos

### Usuario

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string[];
}
```

### JWT Payload

```typescript
interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}
```

## Configuración de Docker

El proyecto incluye configuración Docker para MongoDB:

```yaml
services:
  db:
    image: mongo:8.0
    restart: always
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_DB_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_DB_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DB_NAME}
    container_name: formotex-project-db
    volumes:
      - ./mongo:/data/db
```

## Scripts Disponibles

```bash
npm run dev        # Ejecutar en modo desarrollo con tsx watch
npm run build      # Compilar TypeScript a JavaScript
npm run start      # Ejecutar aplicación compilada
```

## Middleware Implementados

### AuthMiddleware

- Verifica la validez de tokens JWT
- Extrae información del usuario del token
- Protege rutas que requieren autenticación

### AdminMiddleware

- Verifica que el usuario tenga rol de administrador
- Se ejecuta después del AuthMiddleware
- Protege rutas administrativas

## Manejo de Errores

Sistema robusto de manejo de errores con:

- **CustomError** para errores específicos del dominio
- **Logging detallado** para debugging
- **Respuestas JSON consistentes**
- **Códigos de estado HTTP apropiados**

## Patrones Implementados

- **Repository Pattern** - Abstracción de acceso a datos
- **Use Case Pattern** - Lógica de negocio encapsulada
- **Mapper Pattern** - Transformación entre capas
- **Middleware Pattern** - Interceptores de peticiones
- **DTO Pattern** - Validación y transferencia de datos

## Estructura de Base de Datos

### Colección Users

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: [String]
}
```
