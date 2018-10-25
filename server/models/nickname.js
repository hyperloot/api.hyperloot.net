'use strict';

module.exports = function(Nickname) {

  Nickname.findByName = function(name, pageOffset, cb) {
    var limit = 10;
    var page = (pageOffset != null) ? pageOffset : 0;
    var skip = page * limit;
    Nickname.find({where: {nickname: name}, limit: limit, skip: skip}, function(err, nicknames) {
      cb(err, nicknames);
    });
  };

  Nickname.remoteMethod('findByName', {
      'http': {
        'path': '/findByName', 'verb': 'get'
      },
      'accepts': [
        { 'arg': 'nickname', 'type': 'string', 'required': true,
          'arg': 'page', 'type': 'integer', 'required': false }
      ],
      'returns': [
        { 'arg': 'nicknames', 'type': 'array', 'root': true }
      ]
    });

};
