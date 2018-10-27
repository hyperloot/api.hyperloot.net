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
