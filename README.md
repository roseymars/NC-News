# NC News API #

Welcome to NC News API. This is my backend project piece as part of my Software Development bootcamp project, where server endpoints have been created. Everything has been implemented using Test Driven Development and using custom error handling.

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

In order to run all tests, use the "npm run test" command


## Node.js and PostgreSQL minimum version requirements ##

Node.js: 16.13.0
PostgreSQL: 8.7.3


## Hosted version of NC News API ##

https://my-nc-news-project.herokuapp.com/api

