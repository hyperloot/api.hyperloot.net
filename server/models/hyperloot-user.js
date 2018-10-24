'use strict';

module.exports = function(Hyperlootuser) {


  function isEmailValid(email) {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(email)
  }

  Hyperlootuser.canRegisterEmail = function(email, cb) {

    if (isEmailValid(email) == false) {
      cb({message: "Email is not valid"}, null)
      return
    }

		Hyperlootuser.findOne({
			where: {
				email: email
			}}, function(err, user) {
				if (err) {
					cb(null, false)
				} else {
          var result = user == null ? true : false
					cb(null, result)
				}
			});
	}

	Hyperlootuser.remoteMethod('canRegisterEmail', {
		'http': {
			'path': '/canRegisterEmail', 'verb': 'get'
		},
		'accepts': [
			{ 'arg': 'email', 'type': 'string', 'required': true }
		],
		'returns': [
			{ 'arg': 'canRegister', 'type': 'boolean', 'root': true }
		]
	});
};
