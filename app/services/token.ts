import { sign } from 'jsonwebtoken';

import {AUTHTPE, SECRET_KEY} from '../config/env'

class AuthenticateService {
    async generateToken(userId: string): Promise<string> {
        return sign({ id: userId }, SECRET_KEY!, { expiresIn: '30d' });
    }
}

export { AuthenticateService }