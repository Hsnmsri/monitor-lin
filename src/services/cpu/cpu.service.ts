import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import Cpu from 'src/core/models/Cpu.model';
import CpuUsage from 'src/core/models/CpuUsage.model';
import environment from 'src/environment/environment';
import sleep from 'src/helpers/sleep';

@Injectable()
export class CpuService {
    private watchDelayMS: number = 2000;
    private watchStatus: boolean = false;

    /**
     * Retrieves the CPU usage statistics, including total usage and per-core usage, 
     * by reading and parsing the `/proc/stat` file twice with a delay in between.
     *
     * @param delayMs - The delay in milliseconds between the two readings of `/proc/stat`. Defaults to 100ms.
     * @returns A promise that resolves to a `Cpu` object containing:
     * - `total_usage`: An object representing the total CPU usage statistics, including a calculated total usage percentage.
     * - `cores`: An array of objects representing the usage statistics for each individual CPU core, including calculated usage percentages.
     *
     * @throws An error if reading or parsing the `/proc/stat` file fails.
     */
    async getUsage(delayMs = 1000): Promise<Cpu> {
        function parseStat(stat: string): Map<string, number[]> {
            const lines = stat.split('\n').filter(line => line.startsWith('cpu'));
            const cpuMap = new Map<string, number[]>();
            for (const line of lines) {
                const [name, ...rest] = line.trim().split(/\s+/);
                cpuMap.set(name, rest.map(Number));
            }
            return cpuMap;
        }

        function toCpuUsage(values: number[]): CpuUsage {
            const [
                user, nice, system, idle,
                iowait = 0, irq = 0, softirq = 0,
                steal = 0, guest = 0, guest_nice = 0
            ] = values;

            return {
                user, nice, system, idle,
                iowait, irq, softirq,
                steal, guest, guest_nice
            };
        }

        function computePercent(prev: number[], curr: number[]): number {
            const prevIdle = prev[3] + (prev[4] ?? 0);
            const currIdle = curr[3] + (curr[4] ?? 0);
            const prevTotal = prev.reduce((a, b) => a + b, 0);
            const currTotal = curr.reduce((a, b) => a + b, 0);
            const totalDelta = currTotal - prevTotal;
            const idleDelta = currIdle - prevIdle;
            return totalDelta > 0 ? ((totalDelta - idleDelta) / totalDelta) * 100 : 0;
        }

        try {
            const stat1 = await readFile('/proc/stat', 'utf8');
            const parsed1 = parseStat(stat1);

            await new Promise(res => setTimeout(res, delayMs));

            const stat2 = await readFile('/proc/stat', 'utf8');
            const parsed2 = parseStat(stat2);

            const totalValues1 = parsed1.get('cpu')!;
            const totalValues2 = parsed2.get('cpu')!;

            const total_usage: CpuUsage = {
                ...toCpuUsage(totalValues2),
                total_usage_percent: parseFloat(
                    computePercent(totalValues1, totalValues2).toFixed(2)
                )
            };

            const cores: CpuUsage[] = [];
            for (let i = 0; parsed1.has(`cpu${i}`) && parsed2.has(`cpu${i}`); i++) {
                const v1 = parsed1.get(`cpu${i}`)!;
                const v2 = parsed2.get(`cpu${i}`)!;

                cores.push({
                    ...toCpuUsage(v2),
                    total_usage_percent: parseFloat(
                        computePercent(v1, v2).toFixed(2)
                    )
                });
            }

            return { total_usage, cores };

        } catch (error) {
            console.error('Error reading CPU usage:', error);
            throw new Error('Failed to read CPU usage');
        }
    }

    /**
     * Start watch for cpu overload
     */
    startWatch(overloadCallback: (cpuUsage: Cpu) => void, watchDelayMS?: number) {
        if (this.watchStatus) return;

        this.watchDelayMS = watchDelayMS ?? this.watchDelayMS;
        this.watchStatus = true;
        this.watch(overloadCallback);
    }

    /**
     * Stop watch for cpu overload
     */
    stopWatch() {
        this.watchStatus = false;
    }

    /**
     * Watch cpu for overload
     * @param overloadCallback
     */
    private async watch(overloadCallback: (cpuUsage: Cpu) => void) {
        while (this.watchStatus) {
            const cpuUsage: Cpu = await this.getUsage();
            if (cpuUsage.total_usage.total_usage_percent &&
                (cpuUsage.total_usage.total_usage_percent > environment.node.cpu_limit)) overloadCallback(cpuUsage);

            await sleep(this.watchDelayMS);
        }
    }
}
