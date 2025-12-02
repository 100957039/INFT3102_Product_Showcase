// To execute run: node .\password-gen\generate-hashes.js
const bcrypt = require('bcryptjs')

console.log('Admin (admin123): ', bcrypt.hashSync('admin123', 10));
console.log('Author (author123): ', bcrypt.hashSync('author123', 10));