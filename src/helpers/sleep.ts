/**
     * Sleep code as ms
     * @param ms 
     * @returns 
     */
export default function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}