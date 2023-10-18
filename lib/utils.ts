export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function dateParse(date: string): Date {
    const [day, month, year] = date.split('.');
    return new Date(+year, +month - 1, +day);
}

export function isPastDeadline(deadline: Date): Boolean {
    const now = new Date();
    if(deadline.toString() === 'Invalid Date') {
        return false;
    }
    else {
        return deadline.getTime() < now.getTime();
    }
}
