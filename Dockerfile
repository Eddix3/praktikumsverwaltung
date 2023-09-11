# Verwenden Sie ein geeignetes Basisimage, das Ihre Anforderungen erfüllt.
# Zum Beispiel, wenn Sie eine Node.js-Anwendung haben:

FROM node:latest

# Setzen Sie das Arbeitsverzeichnis für die Anwendung
WORKDIR /app

# Kopieren Sie die Anwendungsdateien in das Arbeitsverzeichnis
COPY . .

RUN npm install

# Expose-Ports, wenn erforderlich
EXPOSE 5050
EXPOSE 3000

# Starten Sie sowohl das Backend als auch das Frontend
CMD ["npm", "run", "start"]