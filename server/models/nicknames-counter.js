'use strict';

module.exports = function(Nicknamescounter) {
  Nicknamescounter.getIdentifier = function(nickname, db, callback) {
    db.connector.collection('NicknamesCounter').findOneAndUpdate({
      nickname: nickname
    }, {
      $inc: {
        count: 1
      }
    }, {
      upsert: true
    }, function(err, nicknameCounter) {
      if (err) {
        callback(err, null);
      } else {
        var value = nicknameCounter.value;
        var count = 0;
        if (value != null) {
          count = value.count;
        }
        console.log(nicknameCounter);
        callback(null, count); // object from DB: {value: { nickname, count } }
      }
    });
  };
};
