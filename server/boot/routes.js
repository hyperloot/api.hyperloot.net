'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  function sendError(response, error) {
    response.status(500);
    response.send({error: error});
  }

  function sendResult(response, result) {
    response.send({
      result: result
    });
  }

  router.get('/api/canRegisterEmail', function(req, res, next) {
    var email = req.query['email'];
    var User = server.models.HyperlootUser;
    User.canRegisterEmail(email, function(err, result) {
      if (err) {
        sendError(res, err);
      } else {
        sendResult(res, {
          email: email,
          isAvailable: result
        });
      }
    });
  });

  router.get('/api/nicknameSearchSuggestions', function(req, res, next) {
    var nickname = req.query['nickname'];
    var page = req.query['page'];
    var Nickname = server.models.Nickname;

    Nickname.findByName(nickname, page, function(err, nicknames) {
      if (err) {
        sendError(res, err);
      } else {
        var response = [];
        for (var i = 0; i < nicknames.length; i++) {
          var nickname = nicknames[i];
          response.push({
            nickname: nickname.nickname,
            identifier: nickname.identifier,
            walletAddress: nickname.walletAddress
          });
        }
        sendResult(res, response);
      }
    });
  });

  router.get('/api/findNicknameByWalletAddress', function(req, res, next) {
    var walletAddress = req.query['address'];
    var Wallet = server.models.Wallet;
    var HyperlootUser = server.models.HyperlootUser;

    Wallet.findWallet(walletAddress, function(err, wallet) {
      if (err) {
        sendError(res, err);
      } else {
        if (wallet == null || wallet.userId == null) {
          sendError(res, 'There are no such users');
          return;
        }

        HyperlootUser.findById(wallet.userId, {
          include: 'userNickname'
        }, function(err, user) {
          if (err) {
            sendError(res, err);
          } else {
            if (user == null || user.userNickname == null) {
              sendError(res, 'User doesn\'t have nickname');
              return;
            }
            var userJSON = user.toJSON();
            var nickname = userJSON.userNickname;
            sendResult(res, {
              nickname: nickname.nickname
            });
          }
        });
      }
    });
  });

  router.post('/api/login', function(req, res, next) {
    var login = req.body.login;
    var password = req.body.password;
    var HyperlootUser = server.models.HyperlootUser;

    HyperlootUser.login({
      email: req.body.email,
      password: req.body.password
    }, function(err, token) {
      if (err) {
        sendError(res, err);
        return;
      }

      var properties = {include: ['userNickname', 'wallets']};
      HyperlootUser.findById(token.userId, properties, function(err, user) {
        if (err) {
          sendError(res, err);
        } else {
          if (user == null) {
            sendError(res, 'User doesn\'t exist');
            return;
          }

          var userObj = user.toJSON();

          var nickname = userObj.userNickname;
          if (nickname == null) {
            sendError(res, 'User doesn\'t have nickname');
            return;
          }

          var wallet = userObj.wallets[0];
          if (wallet == null) {
            sendError(res, 'User doesn\'t have at least one wallet');
            return;
          }

          sendResult(res, {
            email: userObj.email,
            userId: userObj.id,
            accessToken: token.id,
            nickname: nickname.nickname,
            walletAddress: wallet.address
          });
        }
      });
    });
  });

  router.post('/api/signup', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var nickname = req.body.nickname;
    var walletAddress = req.body.walletAddress;

    var userObj = {
      email: email,
      password: password
    };

    var HyperlootUser = server.models.HyperlootUser;
    var NicknamesCounter = server.models.NicknamesCounter;
    var db = server.datasources.hlapi;

    HyperlootUser.create(userObj, function(err, user) {
      if (err) {
        sendError(res, err);
        return;
      }

      console.log(user);

      NicknamesCounter.getIdentifier(nickname, db, function(err, identifier) {
        if (err) {
          sendError(res, err);
          return;
        }
        user.userNickname.create({nickname: nickname, identifier: identifier}, function(err, nickname) {
          if (err) {
            sendError(res, err);
            return;
          }

          user.wallets.create({address: walletAddress}, function(err, wallet) {
            if (err) {
              sendError(res, err);
              return;
            }

            user.save();
            sendResult(res, user);
          });
        });
      });
    });
  });

  router.get('/blockscout/tokenList', function(req, res, next) {
    var address = req.query['address'];
    var blockscout = server.models.Blockscout;
    blockscout.getTokenList(address, function(err, list) {
      if (err) {
        sendError(res, err);
        return;
      }

      sendResult(res, list);
    });
  });

  router.get('/blockscout/tokentx', function(req, res, next) {
    var address = req.query['address'];
    var blockscout = server.models.Blockscout;
    blockscout.getTokenTransactions(address, function(err, list) {
      if (err) {
        sendError(res, err);
        return;
      }

      sendResult(res, list);
    });
  });

  server.use(router);
};
