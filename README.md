![alt text](https://prosperna.com/wp-content/uploads/2021/08/ProspernaLogo.svg)

# Prosperna Coding Exam

### By Philip Jon E Lewis

philipjonlewis@gmail.com

**Position Applied : Backend Developer (NodeJS)**

---

### Authentication and Product server

[API Documentation](https://www.example.com)
Made via Postman

---

## Tech Stack

### Language

- Typescript

#### Backend

- NodeJS
- ExpressJS

#### Database

- MongoDB
- Mongoose

#### Security

- Json Web Token (JWT)
- JWT Cookie

#### Testing

- Vitest (Built on top of Jest)
- Supertest

---

## Instructions

1. Download or clone the repo
2. Go inside the folder
3. Run the code:
   > `npm install`
4. Install dotenv for environment variables
5. Make a .env file with the following code

   ```
    DB_PORT_DEVELOPMENT=*Add MongoDB development port i.e. mongodb://127.0.0.1:27017/prosperna*

    DB_PORT_PRODUCTION=*Add MongoDB production port*

    ENVIRONMENT=development

    PORT=*Add backend port number*

    WALKERS_SHORTBREAD=*Add cookie parser secret*

    AUTH_TOKEN_KEY=*Add JWT cookie auth token secret*
   ```

6. Run this code to run in development mode

   > `npm run dev`

7. Run this code to build

   > `npm run build`

8. Run this code for unit testing

> `npm run test`

9. Run this code to test with vitest ui

   > `npm run testwatch`

---
