const validUrl = require("valid-url");

// Regular expression to validate custom short codes
// This regex ensures the code is 6 to 8 characters long and contains only letters and numbers
const CODE_RE = /^[A-Za-z0-9]{6,8}$/;

function isValidUrl(u){
    // validUrl.isWebUri() returns the URL if valid, undefined if invalid
    return validUrl.isWebUri(u);
}

function isValidCode(c){
    // Test the code against the regex
    return CODE_RE.test(c);
}

module.exports =  {isValidUrl,isValidCode};