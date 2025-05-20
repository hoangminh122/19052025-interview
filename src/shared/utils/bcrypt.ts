import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constant/bcypt.constant';

function comparePassword(
    attempt: string | undefined,
    passwordHash: string | undefined,
): Promise<boolean> {
    return bcrypt.compare(attempt, passwordHash);
}

function getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export {
    comparePassword,
    getHash
}