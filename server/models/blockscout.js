'use strict';

module.exports = function(Blockscout) {
  var Blockchain = {'Main': 'mainnet', 'Ropsten': 'ropsten'};
  Object.freeze(Blockchain);

  function currentBlockchain() {
    var networkName = process.env.BLOCKCHAIN;
    if (networkName == null) {
      return Blockchain.Ropsten;
    }

    return Blockchain[networkName];
  }

  Blockscout.getTokenList = function(address, callback) {
    console.log(currentBlockchain());
    Blockscout.tokenlist(currentBlockchain(), address, function(err, result) {
      callback(err, result);
    });
  };
};
