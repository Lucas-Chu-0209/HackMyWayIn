# MCP 最小權限政策

本次工作只需要本機 repo 讀寫、檢查與官方文件查閱；不需要雲端寫入 MCP。此文件為行為政策，不是可由 Codex 自動載入的權限設定。

| 能力 | 預設範圍 | 額外授權條件 |
| --- | --- | --- |
| 本機讀檔／Git diff | 本 repo、相關工具文件；機密排除 | 跨專案或個人資料 |
| 編輯／測試 | 已授權需求相關檔案、本機驗證 | 刪檔、改架構範圍、升級依賴 |
| 文件查詢 | 公開官方文件 | 傳送私有程式或使用帳號 |
| 瀏覽器 | 必要的本機網站驗證 | 操作已登入服務或送出資料 |
| GitHub / 部署 / DNS / 資料庫 MCP | 不啟用 | 先確認具體資源及操作；讀取與寫入分開授權 |
| shell / eval 類 MCP | 不啟用 | 工具本身權限寬廣，不得以名稱 allowlist 當成資源隔離 |

## 設定與驗收

官方支援 project-scoped `.codex/config.toml` 的 MCP 設定：以 `enabled = false` 停用不需要的 server；有必要才設定明確 `enabled_tools` 白名單。Plugin 提供的 server 要在 `plugins.<plugin>.mcp_servers.<server>` 設定，不能只限制一般 `mcp_servers`。

2026-09-10 非機密設定盤點：使用者設定有 `node_repl` 及已停用的 `computer-use`；已安裝 unified-computer-use plugin 的 MCP ID 為 `cua_repl`。本專案限制這些通用電腦／程式執行 MCP；原生本機檔案與 shell 驗證仍依宿主 sandbox 控制。

其他由宿主注入的工具、app connector 與 plugin 不會因這些條目自動全部停用。啟用新服務前，須列出實際 server / tool IDs，逐一限制；不能用空表格宣稱所有繼承權限已清空。

每次新增 MCP：記錄用途、server、允許工具、資源範圍、憑證 scope、有效時間、撤銷方式；採專案專用唯讀憑證與服務端授權。部署寫入需任務明確授權，結束後撤銷臨時權限。憑證不得寫入 repo。

設定重新載入後，核對有效工具清單，確認禁止工具不存在；用允許的唯讀呼叫驗證指定資源可讀。不要對正式環境發出禁止的寫入呼叫作測試。本次執行中的 session 不因新設定檔而自動撤銷既有工具，必須在新 session 驗收後才能聲稱已生效。

參考：[OpenAI MCP 設定文件](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)。
