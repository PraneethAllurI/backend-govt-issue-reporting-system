const crypto = require('crypto');

// Generate a 256-bit secret key (32 bytes)
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);
