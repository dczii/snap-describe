export const validator = <T>(...validators: Array<(value: T) => boolean>) => (value: T): boolean => {
    return validators.every(validator => validator(value))
}

export const isSafeInput = () => (str: string): boolean => !/[\[\]<>\/{}()"';:`$&|=*\\]/.test(str); 
export const isLength = (min: number = 3, max: number = 50) => (str: string): boolean => str.length >= min && str.length <= max
export const isValidEmail = (email: string) => {
    if (/[<>\[\]{}"';:`$&|=*\\]/.test(email)) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export const isValidInput = validator(isSafeInput(), isLength())

export const isValidPassword = (password: string): boolean => {
    const hasUpper = /[A-Z]/.test(password);  
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return password.length >= 8 && password.length <= 64 &&
            hasUpper && hasLower && hasNumber && hasSpecial;
};


