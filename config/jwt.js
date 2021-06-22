const jwt = require('jsonwebtoken')

const secret = '9bIopuq2ea5gDTspoDzQHTdXFTZJgQFfsNKY';

module.exports = {
    sign: payload => jwt.sign(payload, secret, {expiresIn: 86400}),
    verify:  token => jwt.verify(token, secret)
}