import { Injectable } from '@nestjs/common';
import { On, Start, Update } from 'nestjs-telegraf';
import formatText from 'src/helpers/formatText';
import { Context } from 'telegraf';
import { CpuService } from '../cpu/cpu.service';
import Cpu from 'src/core/models/Cpu.model';
import formatDate from 'src/helpers/formatDate';
import Memory from 'src/core/models/Memory.model';
import { MemoryService } from '../memory/memory.service';
import formatDataKB from 'src/helpers/formatDataKB';
import Disk from 'src/core/models/Disk.model';
import { DiskService } from '../disk/disk.service';
import { SettingService } from '../setting/setting.service';

@Injectable()
@Update()
export class TelegramService {
    constructor(
        private readonly cpuService: CpuService,
        private readonly memoryService: MemoryService,
        private readonly diskService: DiskService,
        private readonly settingService: SettingService
    ) { }

    @Start()
    private async onStart(context: Context) {
        // send global message to any users
        await this.sendGlobalWelcome(context);

        // is admin
        if (!this.isAdmin(context.from!.id)) return;

        // send short report
        await this.sendShortReport(context);
    }

    @On('text')
    private async onText(context: Context) {
        if (!this.isAdmin(context.from!.id)) return;

        switch (context.text!.trim()) {
            case "status": {
                this.sendShortReport(context);
                break;
            }
            case "watch": {
                this.cpuService.startWatch((cpuUsage: Cpu) => this.sendCpuOverload(context, cpuUsage));
                this.memoryService.startWatch((memoryUsage: Memory) => this.sendMemoryOverload(context, memoryUsage));
                this.sendWatchEnabled(context);
                break;
            }
            case "unwatch": {
                this.cpuService.stopWatch();
                this.memoryService.stopWatch();
                this.sendWatchDisabled(context);
                break;
            }
        }
    }

    /**
     * Checks if a user is an admin.
     * @param userId - The ID of the user to check.
     * @returns True if the user is an admin, otherwise false.
     */
    isAdmin(userId: number): boolean {
        return (process.env['ADMINS']!.split(',')).findIndex(adminId => adminId == userId.toString()) != -1;
    }

    /**
     * Sends a global welcome message to the user via the Telegram bot.
     *
     * This function formats a welcome message using the provided context and
     * environment variables, then sends it as a reply to the user. The message
     * is sent with HTML parsing enabled.
     *
     * @param context - The Telegram context object containing information about
     *                  the current interaction, including the user details.
     */
    async sendGlobalWelcome(context: Context) {
        await context.reply(formatText('global_welcome', {
            bot_name: process.env['BOT_NAME'] ?? "NOT_SET",
            user_id: context.from!.id.toString(),
        }), {
            parse_mode: 'HTML'
        })
    }

    /**
     * Send to user short report
     * @param context 
     */
    async sendShortReport(context: Context) {
        const cpuUsage: Cpu = await this.cpuService.getUsage();
        const memoryUsage: Memory = await this.memoryService.getUsage();
        const diskUsage: Disk | false = await this.diskService.getUsage();

        await context.replyWithHTML(formatText('short_report', {
            node_name: this.settingService.getNodeName() ?? "NOT_SET",
            cpu_total_usage: `${cpuUsage.total_usage.total_usage_percent?.toString() ?? "0"}%`,
            cpu_cores: cpuUsage.cores.length.toString(),
            cpu_core_usage: cpuUsage.cores.map(core => `${core.total_usage_percent}%`).join(" | "),
            memory_total: formatDataKB(memoryUsage.total),
            memory_used: formatDataKB(memoryUsage.used),
            memory_free: formatDataKB(memoryUsage.available),
            disk_total: diskUsage ? formatDataKB(diskUsage.total) : "NaN",
            disk_used: diskUsage ? formatDataKB(diskUsage.used) : "NaN",
            disk_free: diskUsage ? formatDataKB(diskUsage.available) : "NaN",
        }), {
            reply_markup: {
                keyboard: [
                    [{ text: "status" },],
                    [{ text: "watch", }, { text: "unwatch" }],
                ],
                resize_keyboard: true,
            }
        });
    }

    /**
     * Send to user watch enabled message
     * @param context 
     */
    async sendWatchEnabled(context: Context) {
        context.replyWithHTML(formatText('watch_enabled'));
    }

    /**
     * Send to user watch disabled message
     * @param context 
     */
    async sendWatchDisabled(context: Context) {
        context.replyWithHTML(formatText('watch_disabled'));
    }

    /**
     * Send to user cpu overload usage warning
     * @param context 
     * @param cpuUsage 
     */
    async sendCpuOverload(context: Context, cpuUsage: Cpu) {
        context.replyWithHTML(
            formatText('cpu_overload_warning', {
                node_name: process.env['NODE_NAME'] ?? "NOT_SET",
                cpu_usage: `${cpuUsage.total_usage.total_usage_percent}%`,
                cpu_cores_usage: cpuUsage.cores.map(core => `${core.total_usage_percent}%`).join(" | "),
                time: formatDate("YYYY/MM/DD HH:mm"),
            })
        )
    }

    /**
     * Send to user memory overload usage warning
     * @param context 
     * @param memoryUsage 
     */
    async sendMemoryOverload(context: Context, memoryUsage: Memory) {
        context.replyWithHTML(
            formatText('memory_overload_warning', {
                node_name: process.env['NODE_NAME'] ?? "NOT_SET",
                memory_usage: `${memoryUsage.usage_percent}%`,
                memory_total: formatDataKB(memoryUsage.total),
                memory_available: formatDataKB(memoryUsage.available),
                memory_used: formatDataKB(memoryUsage.used),
                time: formatDate("YYYY/MM/DD HH:mm"),
            })
        )
    }
}
