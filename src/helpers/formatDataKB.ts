/**
 * Format a size in KB to a more human-readable format (MB, GB, TB).
 * @param sizeKB 
 * @returns 
 */
export default function formatDataKB(sizeKB: number): string {
    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = sizeKB;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size = size / 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}