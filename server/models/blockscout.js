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

  function responseError(response) {
    var status = response.status;
    var message = response.message;

    if (status == 0 && message != null) {
      return message;
    }

    return null;
  }

  Blockscout.getTokenList = function(address, callback) {
    Blockscout.tokenlist(currentBlockchain(), address, function(err, result) {
      if (err) {
        callback(err, null);
        return;
      }

      if (result) {
        var error = responseError(result);
        if (error != null) {
          callback(error, null);
          return;
        }

        var data = result.result;
        callback(null, data);
      } else {
        callback('No result', null);
      }
    });
  };

  Blockscout.getTokenTransactions = function(address, callback) {
    Blockscout.tokentx(currentBlockchain(), address, function(err, result) {
      if (err) {
        callback(err, null);
      }
      if (result) {
        var error = responseError(result);
        if (error != null) {
          callback(error, null);
          return;
        }

        callback(null, result);
      } else {
        callback('No result', null);
      }
    });
  };
};
