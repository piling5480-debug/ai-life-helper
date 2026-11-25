# AI 生活小幫手｜碧玲のAI生活研究室

台灣人日常 10 件事，一個 AI App 搞定：拍照翻譯、看懂帳單、寫 LINE 訊息、排行程、讀郵件、讀文件、規劃捷運路線、練語言、認植物、設提醒。

- Android（Chrome）：打開網站 → 點「安裝」或選單「安裝應用程式」
- iPhone（Safari）：分享 → 加入主畫面

網址：https://piling5480-debug.github.io/ai-life-helper/

## 專案結構

| 檔案 | 用途 |
|---|---|
| `index.html` | App 本體（單一檔案） |
| `manifest.webmanifest`、`sw.js`、`icons/` | 讓 Android / iPhone 可以安裝成 App |
| `worker/` | Cloudflare Worker，負責保管 Claude API Key |
| `.github/workflows/deploy-worker.yml` | 推送 `worker/` 時自動部署 Worker |

## 一次性設定

### 1. 開啟 GitHub Pages
Settings → Pages → Source 選 **Deploy from a branch** → `main` / `/ (root)` → Save。

### 2. 自動部署 Worker
到 Settings → Secrets and variables → Actions 新增 4 個 Secret：

| 名稱 | 內容 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → 用「Edit Cloudflare Workers」範本建立 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 首頁右側的 Account ID |
| `ANTHROPIC_API_KEY` | Claude API Key |
| `ACCESS_CODE` | 自己訂一組存取碼，App 裡要填一樣的 |

接著到 Actions → 部署 Cloudflare Worker → Run workflow。完成後 Worker 網址為
`https://ai-life-helper.<你的子網域>.workers.dev`。

### 3. App 內設定
打開網站 → 右上角 ⚙️ → 填入 Worker 網址與存取碼 → 儲存。

> API Key 只存在 Cloudflare，不會出現在 GitHub 或網頁原始碼裡。
