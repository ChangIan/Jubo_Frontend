# Jubo - Frontend

## Environment

- Docker 24.0.2
- Node v18.15.0
- npm 9.5.0

## Initialize

```bash
# Run Init
$ npm uninstall -g create-react-app
$ npm install -g create-react-app
$ npx create-react-app jubo_frontend
$ npm run start
$ npm run test
$ npm run build
$ npm install --save @mui/material @emotion/react @emotion/styled @mui/icons-material axios
$ npm install --save react-router-dom
$ npm install --save validator
$ npm install --save dotenv
$ npm install --save moment
$ npm install --save lodash
# Build Local Image on Docker
$ docker build -t "jubofrontend:0.0.1" -t "jubofrontend:latest" .
# Run App on Docker
$ docker run -d --restart=always --name jubofrontend -p 8877:80 jubofrontend:latest
```

## Snapshot

### Patients

<img src="./snapshot/snapshot1.png" width="75%" height="75%">

### Orders

<img src="./snapshot/snapshot2.png" width="75%" height="75%">
