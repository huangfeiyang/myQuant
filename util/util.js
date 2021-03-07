let CryptoJS = require('crypto-js');

exports.sha256WithBase64 = function (str, key){
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(str, key));
}

exports.sha384WithHex = function (str, key) {
    return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA384(str, key));
}

exports.sha256WithHex = function (str, key) {
    return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(str, key));
}