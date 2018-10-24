'use strict';

module.exports = function(Hyperlootuser) {
	Hyperlootuser.canRegister = function(email, callback) {
		Hyperlootuser.findOne({
			where: {
				email: email
			}}, function(err, user) {
				if (err) {
					callback(false)
				} else {
					callback(true)
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
