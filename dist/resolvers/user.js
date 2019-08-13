"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _auth = require("../auth");

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require("../permissions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  User: {
    teams: function teams(parent, args, _ref) {
      var models = _ref.models,
          user = _ref.user;
      return models.sequelize.query("select * from teams as team join members as member on team.id = member.team_id where member.user_id=?", { replacements: [user.id], model: models.Team, raw: true });
    }
  },
  Query: {
    me: _permissions.requireAuth.createResolver(function (parent, args, _ref2) {
      var models = _ref2.models,
          user = _ref2.user;
      return models.User.findOne({
        where: {
          id: user.id
        }
      });
    }),
    allUsers: function allUsers(parent, args, _ref3) {
      var models = _ref3.models;
      return models.User.findAll();
    },
    getUser: function getUser(parent, _ref4, _ref5) {
      var userId = _ref4.userId;
      var models = _ref5.models;
      return models.User.findOne({ where: { id: userId } });
    }
  },
  Mutation: {
    register: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, args, _ref7) {
        var models = _ref7.models;
        var user;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return models.User.create(args);

              case 3:
                user = _context.sent;
                return _context.abrupt("return", {
                  ok: true,
                  user: user
                });

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context.t0, models)
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 7]]);
      }));

      return function register(_x, _x2, _x3) {
        return _ref6.apply(this, arguments);
      };
    }(),

    login: function login(parent, _ref8, _ref9) {
      var email = _ref8.email,
          password = _ref8.password;
      var models = _ref9.models,
          SECRET = _ref9.SECRET,
          SECRET2 = _ref9.SECRET2;
      return (0, _auth.tryLogin)(email, password, models, SECRET, SECRET2);
    }
  }
};