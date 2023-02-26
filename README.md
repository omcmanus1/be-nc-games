# NC GAMES: Board Games Ratings App

## Background

This is the backend portion of a board games rating app - created as a personal project while on the Northcoders bootcamp. This API allows users to access various data points of the application, with GET/POST/PATCH/DELETE functionality.

### Technologies Used

- node.js
  - API built using express.js
- PSQL
 - Integrated using node-postgres
- Tested using jest

## Link To Hosted Version

[/api page - lists current available endpoints with explanations and examples](https://nc-games-74ev.onrender.com/api)

## Setup Instructions

### To Clone & Run Locally:

1. Run `git clone https://github.com/omcmanus1/be-nc-games.git` in your chosen directory. 
2. Run `npm install` to install the necessary dependencies.

### Get Setup With Local Databases:

1. Download and launch a PostgreSQL instance - [instructions here](https://postgresapp.com/)
2. Create two new .env files (appended with '.test' and '.dev').
3. Inside each file, set the relevant PGDATABASE env variable with your chosen database names - for example: 'PGDATABASE=my_database'.
4. Run `npm run setup-dbs` to trigger the initial database setup.
5. Run `npm run seed` if you want to seed the development databases.

### Testing:

- The test file `app.test.js` uses a set of relevant test data.
- To run the tests locally, run `npm test app`.
  - Each test will trigger the re-seeding of the test database with the above data, so does not need to be run manually. 
  
## Minimum Requirements

- Node: 18.12.1
- PSQL: 14.6
