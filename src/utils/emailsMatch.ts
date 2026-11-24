export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function emailsMatch(a: string, b: string) {
    return normalizeEmail(a) === normalizeEmail(b);
}

export function includesEmail(emails: string[], email: string) {
    return emails.some((candidate) => emailsMatch(candidate, email));
}
