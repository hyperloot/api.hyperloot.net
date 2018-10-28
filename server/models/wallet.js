'use strict';

module.exports = function(Wallet) {
  Wallet.findWallet = function(walletAddress, cb) {
    Wallet.findOne({where: {address: walletAddress}}, function(err, wallet) {
      cb(err, wallet);
    });
  };

  Wallet.remoteMethod('findWallet', {
    'http': {
      'path': '/findWallet', 'verb': 'get'
    },
    'accepts': [
      {'arg': 'walletAddress', 'type': 'string', 'required': true}
    ],
    'returns': [
      {'arg': 'wallet', 'type': 'object', 'root': true}
    ]
  });
};
