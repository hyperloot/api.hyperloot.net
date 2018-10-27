'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  function sendError(response, error) {
    response.status(500);
    response.send({error: error});
  }

  router.get('/api/canRegisterEmail', function(req, res, next) {
    var email = req.query['email'];
    var User = server.models.HyperlootUser;
    User.canRegisterEmail(email, function(err, result) {
      if (err) {
        sendError(res, err);
      } else {
        res.send({result: {email: email, result: result}});
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
          response += {
            nickname: nickname.nickname,
            identifier: nickname.identifier,
            walletAddress: nickname.walletAddress
          };
        }
        res.send({result: response});
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

        HyperlootUser.findById(wallet.userId,
          {
            include: 'userNickname'
          }, function(err, user) {
          if (err) {
            sendError(res, err);
          } else {
            if (user == null || user.userNickname == null) {
              sendError(res, 'User doesn\'t have nickname');
              return;
            }
            res.send({result: {nickname: user.toJSON().userNickname.nickname}});
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

      HyperlootUser.findById(token.userId, {include: ['userNickname', 'wallets']}, function(err, user) {
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

          res.send({
            result: {
              email: userObj.email,
              userId: userObj.id,
              accessToken: token.id,
              nickname: nickname.nickname,
              walletAddress: wallet.address
            }
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

    HyperlootUser.create(userObj, function(err, user) {
      if (err) {
        sendError(res, err);
        return;
      }

      console.log(user);

      user.userNickname.create({nickname: nickname}, function(err, nickname) {
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
          res.send(user);
        });
      });
    });
  });

  server.use(router);
};
