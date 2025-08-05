import bcrypt from 'bcrypt';

const hash = '$2b$10$r2PIXgt/2plJT6k73FPDJOKbcb3tnb0JN2xG6jpbeVKXCUpzQBZqy';  // your bcrypt hash
const plaintextPassword = 'sai';  // replace with the plaintext password you're checking

bcrypt.compare(plaintextPassword, hash, (err, result) => {
  if (err) {
    console.error('Error comparing hash:', err);
  } else if (result) {
    console.log('Password matches!');
  } else {
    console.log('Password does not match!');
  }
});
