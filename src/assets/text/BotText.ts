export const BotText = {
    global_welcome: "Welcome to <strong>:bot_name</strong> bot!\n- Your telegram id is <code>:user_id</code>",
    short_report: `⛓️ <strong>:node_name Node</strong> – Status Report

🖥 <strong>CPU</strong>
• Total Usage: :cpu_total_usage
• Cores (:cpu_cores): :cpu_core_usage

🧠 <strong>Memory</strong>
• Total: :memory_total
• Used: :memory_used
• Free: :memory_free

💾 <strong>Disk</strong>
• Total: :disk_total
• Used: :disk_used
• Free: :disk_free`,
    cpu_overload_warning: `⚠️ <strong>CPU Usage Warning!</strong> <code>:cpu_usage</code>
Detected on <code>:node_name</code>  

Cores
<blockquote>:cpu_cores_usage</blockquote>  
- :time`,
    memory_overload_warning: `⚠️ <strong>Memory Usage Warning!</strong> <code>:memory_usage</code>
Detected on <code>:node_name</code>  

Details
<blockquote>:memory_used/:memory_total</blockquote>  
- :time`,
    watch_enabled: `🔔 <strong>Resource Watch Enabled</strong>`,
    watch_disabled: `🔕 <strong>Resource Watch Disabled</strong>`,
}
