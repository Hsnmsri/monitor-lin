export default interface Node {
    /**
     * The name of the node.
     */
    name: string;

    /**
     * The CPU limit for the node, represented as a percentage.
     */
    cpu_limit: number;

    /**
     * The memory limit for the node, represented as a percentage.
     */
    memory_limit: number;

    /**
     * The path of df export file
     */
    disk_df_path?: string;
}