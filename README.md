# Brever

![Logo](/client/src/logo.svg)

Brever is a messenger web application and a graduation project.

## Authors

-   [Roman Ivanov](https://github.com/JustEnough1)
-   [Christofer Karankevits](https://github.com/ChristoferKarankevits)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. You can also copy it from env_example.

`DB_HOST` - Database host

`DB_PORT` - Database port

`DB_USER` - Database user

`DB_PASSWORD` - Database password

`DATABASE = "brever"` - Database name

`SESSION_SECRET` - Secret used to sign the session cookie

`SERVER_PORT` - Server port

## Run Locally

Clone the project

```bash
  git clone https://github.com/JustEnough1/Brever.git
```

Use MySQL backup to setup a database locally

```bash
  /server/database/brever.sql
```

Go to the server directory

```bash
  cd server/
```

Install dependencies

```bash
  npm i
```

Add environment variables

```bash
  Rename .env_example to .env and set values
```

Start the server

```bash
  npm start
```
