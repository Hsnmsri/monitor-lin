/**
 * Represents the configuration for a bot.
 */
export default interface BotConfig {
    /**
     * The name of the bot.
     */
    name: string;

    /**
     * The authentication token used to interact with the bot.
     */
    token: string;
}