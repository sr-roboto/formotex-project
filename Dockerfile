# Imagen base
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package.json ./
COPY package-lock.json ./
COPY yarn.lock ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Compila el código TypeScript a JavaScript (si es necesario, asumiendo que npm run dev lo maneja o no es un paso separado para este Dockerfile)
# Si hubiera un script de build, sería: RUN npm run build

# Expone el puerto que usa la aplicación
EXPOSE 3000

# Comando para iniciar el servidor
CMD [ "npm", "run", "dev" ]