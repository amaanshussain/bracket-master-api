'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('token', {
    uid: { type: 'string' },
    token: { type: 'string', unique: true },
    expires_at: { type: 'datetime' }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('token', callback);
};

exports._meta = {
  "version": 1
};
