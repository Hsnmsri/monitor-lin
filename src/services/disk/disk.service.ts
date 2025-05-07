import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import Disk from 'src/core/models/Disk.model';
import environment from 'src/environment/environment';

@Injectable()
export class DiskService {
    private dfFilePath?: string;

    constructor() {
        if (environment.node.disk_df_path) this.dfFilePath = environment.node.disk_df_path;
    }

    /**
     * Get Disk Usage
     * @returns 
     */
    async getUsage(): Promise<Disk | false> {
        if (!this.dfFilePath) return false;

        try {
            const raw = await readFile(this.dfFilePath, 'utf-8');
            const lines = raw.trim().split('\n');

            const dataLines = lines.slice(1);

            let total = 0;
            let used = 0;
            let available = 0;

            for (const line of dataLines) {
                const parts = line.trim().split(/\s+/);
                if (parts.length < 6) continue;

                const size = parseInt(parts[1]);     // total
                const usedPart = parseInt(parts[2]); // used
                const avail = parseInt(parts[3]);    // available

                total += size;
                used += usedPart;
                available += avail;
            }

            const usage_percent = total > 0
                ? parseFloat(((used / total) * 100).toFixed(2))
                : 0;

            return {
                total,
                used,
                available,
                usage_percent
            };
        } catch (error) {
            Logger.error('Failed to read disk usage');
            return false;
        }
    }
}
