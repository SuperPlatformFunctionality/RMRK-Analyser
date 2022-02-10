

let CryptoJS = require('crypto-js');

//code from nkn-sdk-js

function cryptoHexStringParse(hexString) {
  return CryptoJS.enc.Hex.parse(hexString)
}

function sha256(str) {
  return CryptoJS.SHA256(str).toString();
}

function sha256Hex(hexStr) {
  return sha256(cryptoHexStringParse(hexStr));
}

function doubleSha256(str) {
  return CryptoJS.SHA256(CryptoJS.SHA256(str)).toString();
}

function doubleSha256Hex(hexStr) {
  return doubleSha256(cryptoHexStringParse(hexStr));
}

function ripemd160(str) {
  return CryptoJS.RIPEMD160(str).toString();
}

function ripemd160Hex(hexStr) {
  return ripemd160(cryptoHexStringParse(hexStr));
}

function md5(str) {
  return CryptoJS.MD5(str).toString();
}

exports.cryptoHexStringParse = cryptoHexStringParse;
exports.sha256 = sha256;
exports.sha256Hex = sha256Hex;
exports.doubleSha256 = doubleSha256;
exports.doubleSha256Hex = doubleSha256Hex;
exports.ripemd160 = ripemd160;
exports.ripemd160Hex = ripemd160Hex;
exports.md5 = md5;
