import BotConfig from "src/core/models/BotConfig.model";
import Node from "src/core/models/Node.model";
import Proxy from "src/core/models/Proxy.model";

export default {
    node: {
        name: "",
        cpu_limit: 100,
        memory_limit: 100,
        disk_df_path: "[PATH]/df_output.txt"
    } as Node,

    bot: {
        name: "",
        token: "",
    } as BotConfig,

    proxy: {
        host: null,
        port: null
    } as Proxy,

    admin: [] as number[]
}