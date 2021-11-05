'use strict';
const jwtDecode = require('jwt-decode');
const base64url = require('base64url');

const parseGatewayToken = function (tokenFromHeader) {
  return JSON.parse(base64url.decode(tokenFromHeader));
};

const parseAuthToken = function (tokenFromHeader) {
  return jwtDecode(tokenFromHeader.replace('Bearer ', ''));
};

module.exports = function () {
  return function (req, res, next) {
    const gatewayRequest = typeof req.headers['x-apigateway-api-userinfo'] !== 'undefined';
    const unParsedToken = req.headers['x-apigateway-api-userinfo'] || req.headers['authorization'];
    if (typeof unParsedToken === 'undefined') {
      res.status(401).json({message: 'No token supplied!!!'});
      return;
    }
    try {
      req.user = gatewayRequest ? parseGatewayToken(unParsedToken) : parseAuthToken(unParsedToken);
    } catch (e) {
      res.status(401).json({message: 'Invalid JWT supplied!'});
      return;
    }
    next();
  };
};
