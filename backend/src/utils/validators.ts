//generator
export const validator = <T>(...validators: Array<(value: T) => boolean>) => (value: T): boolean => {
    return validators.every(validator => validator(value))
}

//general use
// export const isSafeInput = () => (str: string): boolean => !/[\[\]<>\/{}()"';:`$&|=*\\]/.test(str); 
// export const isLength = (min: number = 3, max: number = 250) => (str: string): boolean => str.length >= min && str.length <= max
// export const isValidInput = validator(isSafeInput(), isLength())

//specific
export const isValidEmail = (email: string) => {
    if (/[<>\[\]{}"';:`$&|=*\\]/.test(email)) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export const isValidPassword = (password: string): boolean => {
    const hasUpper = /[A-Z]/.test(password);  
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return password.length >= 8 && password.length <= 64 &&
            hasUpper && hasLower && hasNumber && hasSpecial;
};

export const isPhNum = (num: string): boolean => /^(?:09|\+639)\d{9}$/.test(num);
export const isFullName = (str: string): boolean => /^[\p{L}\p{M}\s'.-]{6,100}$/u.test(str);