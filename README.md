# NC News API #

Welcome to NC News API. This is a RESTful API, where various server endpoints have been created. This project has served as a backend to my frontend project, a news website, which you can find [here](https://news-of-the-north.netlify.app/). Everything has been implemented using Test Driven Development and using custom error handling.

# Instructions #

## Setup ##

Firstly you will need to clone this repo:

```
git clone 
```


Then you can open it up in your favourite code editor

Afterwards, in the root of the project, install all the required dependencies:

```
npm install
```


## Environment Setup ##

* In your .env.test file, write the following: 

 ``
 PGDATABASE=nc_news_test
 ``
* In your .env.development file, write the following:

 ``
 PGDATABASE=nc_news
 ``

Ensure both of these files are added to your .gitignore file



## Seeding Databases ##

Run the following to seed your local database:

``
npm run seed
``


## Running Tests ##

In order to run all tests, use the following command:

``
npm run test
``


## Node.js and PostgreSQL minimum version requirements ##

Node.js: 16.13.0
PostgreSQL: 8.7.3

You can check your version of node by running this command:

``
node -v
``

## Tech Stack: ##

* [psql](https://www.postgresql.org/)
* [pg-format](https://www.npmjs.com/package/pg-format)
* [jest-sorted](https://www.npmjs.com/package/jest-sorted)
* [jest](https://jestjs.io/)
* [supertest](https://www.npmjs.com/package/supertest)
* [express](https://expressjs.com/)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [husky](https://typicode.github.io/husky/#/)

## Hosted version of NC News API ##

https://my-nc-news-project.herokuapp.com/api

