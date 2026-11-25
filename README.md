# AI 生活小幫手｜碧玲のAI生活研究室

台灣人日常 10 件事，一鍵交給手機裡的 AI：拍照翻譯、看懂帳單、寫 LINE 訊息、排行程、讀郵件、讀文件、規劃捷運路線、練語言、認植物、設提醒。

- **免費、不用 API Key**：App 只負責寫好提示詞，再打開使用者自己的 Gemini／ChatGPT／Claude，額度算使用者自己的帳號。
- **不上傳資料**：照片與文字只會交給使用者自己選的 AI App。
- **可安裝**：Android（Chrome）點「安裝」；iPhone（Safari）分享 →「加入主畫面」。
- 「設提醒／排行程」可直接在本機產生 Google 日曆連結或 .ics，完全不經過 AI。

網址：https://piling5480-debug.github.io/ai-life-helper/

## 部署

- **Repo 公開**：推送到 `main` 自動部署到 GitHub Pages（Settings → Pages → Source 選 GitHub Actions）。
- **Repo 私人**（免費帳號無法用 Pages）：在 Actions Secrets 加入 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`，會自動部署到 `https://ai-life-helper.<子網域>.workers.dev`（免費）。

## 結構

| 路徑 | 內容 |
|---|---|
| `public/index.html` | App 本體（單一檔案） |
| `public/manifest.webmanifest`、`public/sw.js`、`public/icons/` | PWA 安裝 |
| `wrangler.toml` | Cloudflare 靜態託管設定（選用） |
