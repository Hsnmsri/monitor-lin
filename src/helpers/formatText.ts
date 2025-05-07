import { BotText } from "src/assets/text/BotText";

/**
 * Formats a text string by replacing placeholders with corresponding values from the provided content object.
 *
 * @param key - The key to retrieve the text from the `BotText` object.
 * @param content - An optional object containing key-value pairs where the keys correspond to placeholders
 *                  in the text (e.g., `:placeholder`) and the values are the replacements.
 *                  If `null` or `undefined`, the function returns the original text.
 * @returns The formatted text with placeholders replaced by their corresponding values from the `content` object.
 */
export default function formatText(key: keyof typeof BotText, content?: Record<string, string> | null): string {
    let text = BotText[key];

    // is null or undefined
    if (!content) return text;

    for (const key in content) {
        text = text.replaceAll(`:${key}`, content[key]);
    }

    return text;
}