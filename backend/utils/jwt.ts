import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export const signToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token: string) => {
    return jwt.decode(token);
};
