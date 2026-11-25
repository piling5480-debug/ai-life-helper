# AI 生活小幫手｜碧玲のAI生活研究室

台灣人日常 10 件事，一個 AI App 搞定：拍照翻譯、看懂帳單、寫 LINE 訊息、排行程、讀郵件、讀文件、規劃捷運路線、練語言、認植物、設提醒。

- Android（Chrome）：打開網站 → 點「安裝」
- iPhone（Safari）：分享 → 加入主畫面
- 使用者不需要 API Key；若作者有設存取碼，第一次使用時輸入即可

## 架構

整個 App 部署在一個 Cloudflare Worker：

| 路徑 | 內容 |
|---|---|
| `public/` | 網站（index.html、PWA manifest、service worker、圖示） |
| `worker/worker.js` | `/api/chat`：代為呼叫 Claude API，API Key 只存在 Cloudflare |
| `wrangler.toml` | Worker 設定（可改 MODEL） |
| `.github/workflows/deploy-worker.yml` | 推送到 main 自動部署 |

Repo 可以設為 Private，GitHub Actions 照樣可以部署。

## 一次性設定

Settings → Secrets and variables → Actions → New repository secret：

| 名稱 | 內容 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token →「Edit Cloudflare Workers」範本 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 首頁 → Workers & Pages 右側的 Account ID |
| `ANTHROPIC_API_KEY` | Claude API Key（console.anthropic.com） |
| `ACCESS_CODE` | 選填。設了之後使用者要輸入這組存取碼 |

設定完到 Actions →「部署到 Cloudflare（網站 + AI）」→ Run workflow。
網址：`https://ai-life-helper.<你的子網域>.workers.dev`
