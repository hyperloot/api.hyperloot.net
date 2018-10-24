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
        res.status(500)
        res.send({error: err})
      } else {
        res.send({result: {email: email, result: result}});
      }
    });
  });

  server.use(router);
};
