# API.Hyperloot.net

This is an API for the wallet app (primarily) and the core for marketplace (in future)

## Features:
* nicknames search suggestions
* login/sign up
* wallet addresses search

## Implemented APIs:
* canRegisterEmail
  * GET /api/canRegisterEmail
  * Query parameters:
    * email - email address
* nicknameSearchSuggestions
  * GET /api/nicknameSearchSuggestions
  * Query parameters:
    * nickname - user nickname
    *page - page offset for search
    * default limit is 10
* findNicknameByWalletAddress
  * GET /api/findNicknameByWalletAddress
  * Query parameters:
    * address - wallet address
* login
  * POST /api/login
  * Body parameters:
    * email - user email
    * password
* signup
  * POST /api/signup
  * Body parameters:
    * email
    * password
    * nickname
    * walletAddress

## Configuration
Process ENV variables:
* MONGODB_USER - Database user for MonboDB
* MONGODB_PASSWORD - Password for DB user
* MONGODB_URI - URI to connect to MongoDB database
* BLOCKCHAIN - Blockchain type for running Blockscout. Options: { Main, Ropsten }
* NODE_ENV - Type of environment { production }

## Setup environment (Heroku + MongoDB Atlas)
1. Create an account on Heroku
1.1 Choose GitHub as a source and select api.hyperloot.net repository
2. Create an account on MongoDB Atlas
2.1 Create a database user with password, these credentials will be used for MONGODB_USER and MONGODB_PASSWORD
2.2 Create a new database, check the connection to the new database
3. Setup environment variables on Heroku:
3.1 MONGODB_USER (e.g. dbuser), MONGODB_PASSWORD (e.g. mypassword123) and MONGODB_URI (e.g. mongodb+srv://cluster.host/<databasename>) are required
3.2. BLOCKCHAIN - choose between mainnet and testnet.
