import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(candidatePassword, hashedPassword);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    if (password.length > 128) {
        return { isValid: false, message: 'Password must be less than 128 characters' };
    }
    
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
        return { isValid: false, message: 'Password must contain at least one letter and one number' };
    }
    
    return { isValid: true };
};
