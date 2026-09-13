# Featured 文章設定

側欄最多顯示五篇已發布文章；背景沿用文章 frontmatter 的 `cover`，只顯示標題、日期與分類。

1. `featured: true` 的文章優先，依 `importance`（1–5，越大越前面）及日期由新到舊排序。
2. 不足五篇時，由其餘文章依日期由新到舊補齊；未指定精選時直接顯示最新五篇。
3. 相同排序值以 slug 排序，避免順序不穩定。草稿仍依既有流程排除。

在 `src/content/posts/文章名稱.mdx` 的開頭兩個 `---` 之間設定：

```yaml
featured: true
importance: 5
```

指定五篇即可固定五個精選位置；若超過五篇，只顯示排序最前的五篇。移除 `featured` 或設為 `false` 會取消優先權，但文章仍可能作為最新文章補位。

修改 `cover`、`title`、`date`、`category` 會同步反映在卡片；不要為排序而更改真實文章日期。

選文邏輯：`src/lib/featured-posts.ts`，由 `src/lib/posts.ts` 呼叫。卡片及四個標題圖示：`src/components/BlogSidebar.tsx`。圖示沿用 16px 與既有配色，區塊外框和排列不變。

MDX 寫作注意：一般文字中的小於符號可寫成 `&lt;`，例如 `>&lt;` 會顯示 `><`；程式片段則放在行內程式碼或程式碼區塊。裸露的 `<` 可能被視為 JSX 標籤，導致整站文章資料收集失敗。
