# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download and install Docker](https://docker.com/)

## Steps to start application

### Clone repo

```bash
git clone https://github.com/Sepulator/nodejs2025Q2-service.git

```

### Switch branch to `logs-errors-auth`

```bash
npm switch logs-errors-auth

```

### Rename `.env.example` to `.env`

```bash
cp .env.example .env
```

Change credentials in `.env`

### Install NPM modules

```bash
npm install
```

### Start container with PostgreSQL database as source of data

```bash
docker-compose up -d postgres
```

### Running application in `dev` mode

```bash
npm start:dev
```

## How to build and start containers

Docker must be started before building an image.

### Build image and start app in container with `prod` profile in background

To start your application in **production** mode, run:

```bash
docker-compose --profile prod up --build -d
```

### Build image and start app in container with `dev` profile in background

To start your application in **development** mode with hot-reloading with `src` changes, run:

```bash
docker-compose --profile dev up --build -d
```

### Display CVEs (Common Vulnerabilities and Exposures) identified in an image

```bash
npm run scan
```

Link to image in [docker hub](https://hub.docker.com/r/sepulator/nodejs2025q2-service)

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing <http://localhost:4000/doc/>.
For more information about OpenAPI/Swagger please visit <https://swagger.io/>.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To test `refresh` endpoint and tokens

```bash
npm run test:refresh
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: <https://code.visualstudio.com/docs/editor/debugging>
