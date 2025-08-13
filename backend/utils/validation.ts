export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    if (email.length > 254) {
        return { isValid: false, message: 'Email address is too long' };
    }
    
    return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; message?: string } => {
    if (!username) {
        return { isValid: false, message: 'Username is required' };
    }
    
    if (username.length < 3) {
        return { isValid: false, message: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 30) {
        return { isValid: false, message: 'Username must be less than 30 characters' };
    }
    
    // Only allow alphanumeric characters and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
    return input.trim().toLowerCase();
};

export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
