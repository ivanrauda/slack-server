"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sequelize = new _sequelize2.default(
// eslint-disable-next-line no-undef
process.env.TEST_DB || "slack", "chaudinh", "katetsui1995", {
  dialect: "postgres",
  operatorAliases: _sequelize2.default.Op,
  define: {
    underscored: true
  }
});

var models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Team: sequelize.import("./team"),
  Message: sequelize.import("./message"),
  Member: sequelize.import("./member.js"),
  DirectMessage: sequelize.import("./directMessage.js"),
  PrivateMembers: sequelize.import("./privateMembers.js")
};

(0, _keys2.default)(models).forEach(function (modelName) {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = _sequelize2.default;
models.op = _sequelize2.default.Op;

exports.default = models;