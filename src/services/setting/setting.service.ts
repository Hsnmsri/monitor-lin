import { Injectable, Logger } from '@nestjs/common';
import Proxy from 'src/core/models/Proxy.model';

@Injectable()
export class SettingService {
    env = require('../../environment/env.json');

    /**
     * Get the name of the node from environment settings.
     * If the node name is not set, it returns null.
     * @returns {string | null} The name of the node or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getNodeName(): string | null {
        try {
            return this.env.node_name ?? null;
        } catch (error) {
            Logger.error('Node name not found in environment settings');
            return null
        }
    }

    /**
     * Get the CPU limit from environment settings.
     * If the CPU limit is not set, it returns null.
     * @returns {number | null} The CPU limit or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getCpuLimit(): number | null {
        try {
            return this.env.cpu_limit ?? null;
        } catch (error) {
            Logger.error('CPU limit not found in environment settings');
            return null;
        }
    }

    /**
     * Get the memory limit from environment settings.
     * If the memory limit is not set, it returns null.
     * @returns {number | null} The memory limit or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getMemoryLimit(): number | null {
        try {
            return this.env.memory_limit ?? null;
        } catch (error) {
            Logger.error('Memory limit not found in environment settings');
            return null;
        }
    }

    /**
     * Get the disk df path from environment settings.
     * If the disk df path is not set, it returns null.
     * @returns {string | null} The disk df path or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getDiskDfPath(): string | null {
        try {
            return this.env.disk_df_path ?? null;
        } catch (error) {
            Logger.error('Disk df path not found in environment settings');
            return null;
        }
    }

    /**
     * Get the bot name from environment settings.
     * If the bot name is not set, it returns null.
     * @returns {string | null} The bot name or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getBotName(): string | null {
        try {
            return this.env.bot.name ?? null;
        } catch (error) {
            Logger.error('Bot name not found in environment settings');
            return null;
        }
    }

    /**
     * Get the bot token from environment settings.
     * If the bot token is not set, it returns null.
     * @returns {string | null} The bot token or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getBotToken(): string | null {
        try {
            return this.env.bot.token ?? null;
        } catch (error) {
            Logger.error('Bot token not found in environment settings');
            return null;
        }
    }

    /**
     * Get the bot admins from environment settings.
     * If the bot admins are not set, it returns null.
     * @returns {string[] | null} The bot admins or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getBotAdmins(): string[] | null {
        try {
            return this.env.bot.admins ?? null;
        } catch (error) {
            Logger.error('Bot admins not found in environment settings');
            return null;
        }
    }

    /**
     * Get the proxy settings from environment settings.
     * If the proxy settings are not set, it returns null.
     * @returns {Proxy | null} The proxy settings or null if not set.
     * @throws {Error} If there is an issue accessing the environment settings.
     */
    getProxy(): Proxy | null {
        try {
            if (this.env.proxy || this.env.proxy.host || this.env.proxy.port) {
                return null;
            }

            return {
                host: this.env.proxy.host,
                port: Number(this.env.proxy.port),
            }
        } catch (error) {
            Logger.error('Proxy settings not found in environment settings');
            return null;
        }
    }
}
