/**
 * Format date by format string
 * @param format date format with YYYY MM DD HH mm ss
 * @param date 
 * @returns 
 */
export default function formatDate(format: string, date?: Date): string {
    date = date ?? (new Date());

    const tokens: { [key: string]: string } = {
        YYYY: date.getFullYear().toString(),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        DD: String(date.getDate()).padStart(2, '0'),
        HH: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0'),
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, token => tokens[token]);
}
