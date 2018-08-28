import uuidv4 from 'uuid/v4';
import { createCipher, createDecipher } from 'crypto';
const ALGORITHM = 'aes-256-ctr';
const SECRET = process.env.ENCRYPT_KEY || 'secret_key'; // secret key that should be handled with process/env

function encode(value) {
    const cipher = createCipher(ALGORITHM, SECRET);
    let encoded = cipher.update(`${uuidv4()}_${value}`, 'ascii', 'base64');
    encoded += cipher.final('base64');

    return encoded;
}

function decode(value) {
    const decipher = createDecipher(ALGORITHM, SECRET);
    let decoded = decipher.update(value, 'base64', 'ascii');
    decoded += decipher.final('ascii');
    const split = decoded.split('_');

    split.shift();

    return split.join('_');
}

export { encode, decode };