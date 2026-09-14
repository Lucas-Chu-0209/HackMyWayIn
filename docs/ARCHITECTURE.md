# Hack My Way In 架構盤點

本文件以 `/Users/lucasauriant/HackMyWayIn` 為準。2026-09-10 同步時 HEAD 為 ff44853，Git 追蹤 107 個檔案（包含工作樹原已刪除的 AGENT.md）。已盤點檔案清單並讀取規則、README、MEMORY、套件設定及核心內容／統計資料流；尚未逐篇審閱文章、逐一驗證 UI 或審計第三方依賴。

## 目錄更正

先前 `/Users/lucasauriant/Desktop/HackMyWayIn` 的 29 檔案單頁版本是另一份 checkout。該版本的「沒有 API／資料庫」「Next.js 16.2.4」「沒有正式網址」及 lint/build 中止紀錄不能用來描述或判定本目錄。本次只整合協作規則、MCP 政策與設定，並依本目錄重寫本文件；未複製舊版網站程式。

## 部署證據

README 與 MEMORY 記載 Vercel 部署及正式網址 https://hackmywayin.vercel.app；Git origin 指向 Lucas-Chu-0209/HackMyWayIn。src/lib/analytics.ts 以 @vercel/kv 讀寫遠端 KV；環境變數名稱為 KV_REST_API_URL、KV_REST_API_TOKEN、VISITOR_SALT，未讀取其值。

這是「Vercel 網站＋遠端 KV 整合」的程式與文件證據，尚不足以判定多雲。SDK 名稱、cf-connecting-ip 相容處理或 GitHub 儲存庫都不能證明底層雲供應商。未核對線上 DNS、Vercel 控制台、KV 供應商／區域或多雲切換，不能宣稱實際部署拓撲已驗證。

## 技術與路由

package.json 宣告 Next.js ^16.3.3、React ^19.2.6、Tailwind ^4.3.1、TypeScript；另有 next-mdx-remote、remark-gfm、mermaid、next-themes、lucide-react、@vercel/kv。這些是宣告範圍，不代表本機已安裝版本。dev 使用 next dev --webpack，build 使用 next build，start 使用 next start，lint 使用 eslint。next.config.ts 設 devIndicators: false，未設定靜態匯出。

| 路徑／模組 | 職責 |
| --- | --- |
| src/app/layout.tsx | metadata、Navbar、ThemeProvider、TransitionProvider、ThemeToggleFab |
| / | Hero、最新文章、分別供桌面與手機使用的 BlogSidebar |
| /posts、/posts/[slug] | 分頁文章列表與 MDX 文章詳情 |
| /about | 個人簡介、專案與聯絡資訊 |
| /categories、/categories/[slug] | 分類列表與篩選 |
| /tags、/tags/[slug] | 標籤列表與篩選 |
| POST /api/analytics/track | Node.js route handler；驗證文章後更新統計 |
| src/content.ts | 個人網站內容 |
| src/content/posts/*.mdx | 文章原文與 frontmatter |
| src/lib/posts.ts | 檔案讀取、MDX 編譯、frontmatter 驗證、草稿排除、排序、分頁、分類標籤、目錄與字數 |
| src/lib/analytics.ts | KV 瀏覽／訪客統計、加鹽訪客 hash、缺設定與錯誤降級 |
| PostAnalyticsTracker、LiveAnalyticsCount | POST 追蹤與 analytics:tracked 事件更新計數 |
| BlogSidebar、posts/PostListItem、PostHeader、PageHeader | 文章列表／詳情與側欄顯示 |
| MermaidRenderer | MDX Mermaid 圖表呈現 |
| theme/ThemeProvider、ThemeToggleFab、TransitionProvider、TypingText | 主題與前端互動效果 |
| 其餘個人網站元件 | Hero、About、Projects、Contact、Avatar、導覽與共用 UI |
| public/ | 品牌、個人照片、文章與專案圖片及範本 SVG |
| .github/dependabot.yml | 依賴更新設定，不能視為部署 workflow |
| AGENTS.md、CLAUDE.md、MEMORY.md | 協作規範、規範引用及歷史決策；歷史文字以目前程式核對 |

## 資料流與既有邊界

文章檔案 → src/lib/posts.ts → Server Components → 文章列表／詳情。getAllPosts、getAllTags、getAllCategories 使用 React cache 做 server render 內重複呼叫去重，不是跨請求持久快取，也不代表所有側欄渲染工作都消失。

文章瀏覽 → PostAnalyticsTracker → POST API → trackPostAnalytics → KV → analytics:tracked → LiveAnalyticsCount。測試文章頁可能觸發統計寫入；功能驗證應使用隔離測試設定，避免寫入正式 KV。

首頁、文章列表、文章詳情與 about 明確呼叫 noStore；analytics 讀取亦呼叫 noStore。文章、分類 slug、標籤 slug 路由已有 generateStaticParams，因此 MEMORY 中「之後新增分類／標籤 generateStaticParams」已與目前程式不同。未因此改動既有 MEMORY。

## 本次同步驗收範圍

同步只允許 AGENTS.md、docs/MCP_POLICY.md、docs/ARCHITECTURE.md、.codex/config.toml 四個路徑；保留目標原有 Next.js 產生規則與 AGENT.md 刪除狀態。以同步前後雜湊檢查既有非機密檔案、比對同步內容、解析 TOML 及 git diff --check 驗證。無應用程式修改，未執行網站 build、瀏覽器測試或正式 KV 呼叫；不宣稱零 bugs。MCP 設定仍須重新載入後核對有效工具。

## 導覽載入回饋（2026-09-13）

站內 Next Link 統一透過 NavigationLink，以 useLinkStatus 顯示 NavigationStatus；使用 portal 避免被導覽列或頁面 transform 裁切。app/loading.tsx 提供路由 Suspense fallback。連結 pending 與頁面 loading 分別涵蓋切換前／串流等待階段，原 TransitionProvider 保留。尊重 reduced-motion，未新增依賴或變更 KV／文章資料流程。

## Hacker Space v1（2026-09-13）

新增 /hacker-space，靜態 Server Page 提供 metadata；HackerSpace Client Component 管理事件選擇、證據、決策與復盤。導覽列與 BlogSidebar 提供入口。

四個固定教學事件集中在 src/lib/hacker-space/scenarios.ts，依類型分類，每案三題（30/30/40 分）、80 分通關，錯誤選擇仍可完成復盤。這是預寫劇本，不是真實 AI 或隨機事件；補救段落明確標為獨立練習。

progress.ts 將完成結果存在 hmwi.hacker-space.progress.v1，驗證 schema 與情境版本，保存最佳／最近分數與完成次數。進行中的選擇不保存。讀寫失敗可繼續遊玩並告知無法保存；分數僅供自我練習，可在本機被修改，不能當成可信排行榜資料。跨分頁透過 storage event 更新。

CSS Module 限定樣式範圍；支援深淺色、手機、鍵盤、reduced-motion。情境使用 .example 保留網域，所有資料與操作均為本機模擬，沒有帳號／AI／寄信／網路掃描整合，也不存取 KV。延伸閱讀是外部官方連結。既有文章與 analytics 資料流程保持不變。

後續若加入登入／公開排行，需要另行設計伺服器驗證、授權、計分可信度與個資保存；不直接信任 localStorage 成績。

### 驗證方式與本次結果

- Node 22.18+／24 可直接執行 `node --test tests/hacker-space.test.mjs`：5 項涵蓋完整／不完整決策、分數、版本與損壞進度、重玩最佳分及儲存失敗。Node 可能提示未指定 module type，未為消除提示改動專案模組設定。
- `tests/hacker-space.browser.cjs` 使用 Playwright 與已安裝 Chrome；可由 PLAYWRIGHT_MODULE 指向既有 Playwright 的 index.mjs 絕對路徑，預設 import("playwright")。先在 127.0.0.1:3107 啟動本機 production server，清空 KV_REST_API_URL / KV_REST_API_TOKEN / VISITOR_SALT；測試只允許 localhost，不會呼叫外部服務。截圖寫入暫存資料夾。
- 瀏覽器回歸涵蓋四事件通關、0 分路線、重玩、持久化、跨分頁、損壞／封鎖 localStorage、篩選、鍵盤開始、技術線索、手機闖關與深淺色。320 / 390 / 768px 檢查新頁面內容不溢出。
- TypeScript 與 production build 通過；新頁面為靜態路由。修改範圍 lint 通過。全站 lint 的既有 MermaidRenderer set-state-in-effect 錯誤與 posts.ts 兩個未使用變數警告保持原狀，未宣稱全站 lint 通過。


## Hacker Space v2

沿用 v1 情境、計分與 localStorage schema，既有成績相容。HackerSpace.tsx 新增 question → intro → dashboard／mission 的入口狀態；每次頁面重新掛載顯示入口，完成或 exit() 返回 Dashboard 不重播。入口 Python 程式碼僅在 React code 元素中顯示字串，沒有執行；Yes 是按鈕，No 是同樣外觀的 span，附帶純裝飾說明。

Challenge Me 在現有劇本中隨機抽題，避開同次造訪剛玩的事件；不是隨機生成故事。任務使用頁面內單一深色視窗，不是多層 modal，保留正常鍵盤與頁面導覽。exit() 直接返回列表，不保存未完成選擇、不攔截 Ctrl+C。決策後仍呈現行動後果，但不呈現分數或依最佳答案變色；結束後才顯示成績與逐題復盤。

Dashboard 以去重分類自動產生總覽／類型卡，顯示已完成的獨立事件數／總數，另列通關數；點卡片篩選 Choose Your Case。Learn More 說明虛構教學來源與目前功能，未來 AI／情資構想標為未提供；FAQ 使用原生 details。

v2 修改集中於 BlogSidebar.tsx、HackerSpace.tsx 及其 CSS Module。入口與任務永遠採深色，Dashboard 沿用全站主題。tests/hacker-space.browser.cjs 已更新為 v2 流程，仍使用本機 3107、隔離 Chrome 與既有 PLAYWRIGHT_MODULE 路徑設定；測試前需停用正式 KV。
