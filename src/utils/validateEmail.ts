/**
 * @param email the email to validate
 * @returns whether the email is valid
 */
export function validateEmail(email: string) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
