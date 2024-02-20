import { v4 as uuidv4 } from 'uuid';

export const generateToken = (isAdmin: boolean): string => {
    const token = uuidv4();

    console.log('Token generated: ', token);

    return token;
};