import CpuUsage from "./CpuUsage.model";

export default interface Cpu {
    total_usage: CpuUsage;
    cores: CpuUsage[]
}