import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import Memory from 'src/core/models/Memory.model';
import sleep from 'src/helpers/sleep';

@Injectable()
export class MemoryService {
    private watchStatus = false;
    private watchDelayMS = 2000;

    /**
     * Read memory usage from /proc/meminfo
     * @returns Memory usage information
     */
    async getUsage(): Promise<Memory> {
        try {
            const meminfo = await readFile('/proc/meminfo', 'utf8');
            const lines = meminfo.split('\n');

            const memTotal = parseInt(this.extractValue(lines, 'MemTotal'));
            const memAvailable = parseInt(this.extractValue(lines, 'MemAvailable'));
            const used = memTotal - memAvailable;
            const usage_percent = parseFloat(((used / memTotal) * 100).toFixed(2));

            return {
                total: memTotal,
                available: memAvailable,
                used,
                usage_percent
            };

        } catch (error) {
            console.error('Error reading memory usage:', error);
            throw new Error('Failed to read memory usage');
        }
    }

    /**
     * Extract value from /proc/meminfo lines
     * @param lines 
     * @param key 
     * @returns 
     */
    private extractValue(lines: string[], key: string): string {
        const line = lines.find(line => line.startsWith(key));
        if (!line) throw new Error(`Missing ${key} in /proc/meminfo`);
        return line.split(':')[1].trim().split(' ')[0]; // return value in kB
    }

    /**
     * Start watching memory usage
     * @param overloadCallback 
     * @param watchDelayMS 
     * @returns 
     */
    startWatch(overloadCallback: (memory: Memory) => void, watchDelayMS?: number) {
        if (this.watchStatus) return;

        this.watchDelayMS = watchDelayMS ?? this.watchDelayMS;
        this.watchStatus = true;
        this.watch(overloadCallback);
    }

    /**
     * Stop watching memory usage
     */
    stopWatch() {
        this.watchStatus = false;
    }

    /**
     * Watch memory usage and call overloadCallback if usage exceeds limit
     * @param overloadCallback 
     */
    private async watch(overloadCallback: (memory: Memory) => void) {
        while (this.watchStatus) {
            const memoryUsage = await this.getUsage();
            if (memoryUsage.usage_percent > Number(process.env['MEMORY_LIMIT'])) {
                overloadCallback(memoryUsage);
            }

            await sleep(this.watchDelayMS);
        }
    }
}
