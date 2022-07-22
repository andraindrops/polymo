# Polymo

Polymo is a web app code base generator for development x10 faster.

## Getting Started

```
npx create-polymo-app APP_NAME
```

```
cd APP_NAME
```

## Setup a database

```
docker-compose up -d
```

We needs [Docker](https://docs.docker.com/get-started/).

```
npx prisma db push
```

## Setup a web app

```
npm install
npm run dev
```

Check page.
<br>
[http://localhost:3000](http://localhost:3000)

## Sign in / up with email magic link

[http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)
<br>
<br>
A magic link for Sign In / Up can be found at MailDev.
<br>
[http://localhost:1080/#/](http://localhost:1080/#/)

## Generate CRUD code

```
npm run crud
```

Enter a model name and attributes.

```
Please enter a model name. todo
```

```
Please enter attributes. title:string,priority:number
```

### Generate CRUD code : Migrate database schemas

```
npx prisma db push
```

### Generate CRUD code : Check CRUD page

Please restart an app server.
<br>
<br>
Check page.
<br>
[http://localhost:3000/todos](http://localhost:3000/todos)

## Support

We can help you, Please contact [GitHub](https://github.com/andraindrops/polymo) or [Twitter](https://twitter.com/polymo_dev).
