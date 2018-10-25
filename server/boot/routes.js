'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  router.get('/api/canRegisterEmail', function(req, res, next) {
    var email = req.query['email'];
    var User = server.models.HyperlootUser;
    User.canRegisterEmail(email, function(err, result) {
      if (err) {
        res.status(500);
        res.send({error: err});
      } else {
        res.send({result: {email: email, result: result}});
      }
    });
  });

  router.get('/api/nicknameSearchSuggestions', function (req, res, next) {
    var nickname = req.query['nickname'];
    var page = req.query['page'];
    var Nickname = server.models.Nickname;

    Nickname.findByName(nickname, page, function (err, nicknames) {
      if (err) {
        res.status(500);
        res.send({error: err});
      } else {
        var response = [];
        for (var i = 0; i < nicknames.length; i++) {
          var nickname = nicknames[i];
          response += { nickname: nickname.nickname, identifier: nickname.identifier, walletAddress: nickname.walletAddress }
        }
        res.send({result: response});
      }

    })
  });

  router.get('/api/findNicknameByWalletAddress', function (req, res, next) {
    var walletAddress = req.query['address'];
    var Wallet = server.models.Wallet;

    Wallet.findWallet(walletAddress, function (err, wallet) {
      if (err) {
        res.status(500);
        res.send({error: err});
      } else {



        res.send({result: response});
      }

    })
  });

  server.use(router);
};
