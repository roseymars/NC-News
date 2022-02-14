# NC News API

## Connecting to the databases locally ##

In order to connect to both test and development databases locally, you will need to install the following npm modules into your project:

* dotenv (https://www.npmjs.com/package/dotenv)
* pg (https://www.npmjs.com/package/pg)

* In your .env.test file, write the following: 'PGDATABASE=nc_news_test'
* In your .env.development file, write the following: 'PGDATABASE=nc_news'

REMEMBER to add both of these files to your .gitignore file
You can write '.env.*' in your .gitignore file and it will ignore any files that begin with .env.

