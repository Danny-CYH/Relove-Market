export function validatePass(pass) {
    const validations = {
        length: pass.length >= 8,
        uppercase: /[A-Z]/.test(pass),
        lowercase: /[a-z]/.test(pass),
        number: /[0-9]/.test(pass),
        special: /[!@#$%^&*(),._?":{}|<>]/.test(pass),
    };

    const isValid = Object.values(validations).every(Boolean);
    const strength = Object.values(validations).filter(Boolean).length;

    return { isValid, validations, strength };
}

export function validatePassStrength(strength) {
    if (strength === 0) return { strengthText: "Very Weak", strengthColor: "text-red-600" };
    if (strength <= 2) return { strengthText: "Weak", strengthColor: "text-red-500" };
    if (strength <= 3) return { strengthText: "Fair", strengthColor: "text-yellow-500" };
    if (strength <= 4) return { strengthText: "Good", strengthColor: "text-blue-500" };
    
    return { strengthText: "Strong", strengthColor: "text-green-600" };
}
