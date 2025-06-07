
# 虛擬博物館導覽員 Artie

[![zh-TW](https://img.shields.io/badge/language-繁體中文-blue.svg)](README.md)

一個使用 Google Gemini API 打造的數位博物館客服 Artie，能以禮貌且幽默風趣的方式，回答您關於博物館與數位展覽的各種問題。

**Live Demo:** `[連結待您部署至 Vercel 後更新]`

## ✨ 功能特色 (Features)

*   與 AI 導覽員 Artie 進行即時對話。
*   Artie 以其獨特的風趣幽默且彬彬有禮的風格回答問題（可透過 `localization.ts` 中的系統指令調整）。
*   能夠根據對話上下文主動延伸話題，提升互動體驗。
*   優雅且回應式的聊天介面，清晰區分使用者與 Artie 的訊息。
*   訊息包含時間戳，方便追溯對話。
*   具備載入中動畫與明確的錯誤狀態提示。
*   使用 Tailwind CSS 打造現代化且美觀的介面。
*   支援 Shift+Enter 在輸入框中換行。
*   支援多語言介面（繁體中文、英文、日文）。

## 🛠️ 技術棧 (Technologies Used)

*   **前端 (Frontend):** React, TypeScript
*   **樣式 (Styling):** Tailwind CSS (透過 CDN 引入並於 `index.html` 中進行客製化)
*   **AI 模型 (AI Model):** Google Gemini API (`@google/genai` 套件)
*   **模組系統 (Module System):** ES Modules (透過 `index.html` 中的 import maps 實現瀏覽器原生載入)
*   **多語言支援 (Localization):** 自訂解決方案 (`localization.ts`)

## 🚀 本地安裝與執行 (Setup and Local Development)

請依照以下步驟在您的本地環境中設定並執行此專案：

### 1. 前置需求 (Prerequisites)

*   [Node.js](https://nodejs.org/) (建議使用 LTS 版本)
*   [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/) (Node.js 通常會一同安裝 npm)

### 2. 取得專案 (Clone Repository)

```bash
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_DIRECTORY_NAME>
```
將 `<YOUR_REPOSITORY_URL>` 替換成您的 GitHub 儲存庫網址，並將 `<PROJECT_DIRECTORY_NAME>` 替換成專案資料夾的名稱。

### 3. 環境變數設定 (Environment Variables)

此專案需要 Google Gemini API 金鑰才能正常運作。

*   在專案的根目錄下建立一個名為 `.env` 的檔案。
*   開啟 `.env` 檔案，並加入您的 API 金鑰，格式如下：

    ```env
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    請將 `YOUR_GEMINI_API_KEY_HERE` 替換成您真實的 Gemini API 金鑰。

    **重要提示:** 應用程式的 `services/geminiService.ts` 檔案中透過 `process.env.API_KEY` 來讀取此金鑰。確保您的開發環境能將此變數正確地傳遞給前端 JavaScript。

### 4. 安裝依賴 (Install Dependencies - for Dev Server)

雖然瀏覽器端的依賴是透過 import maps 從 CDN 載入，但為了更好的本地開發體驗 (例如使用 Vite 這類型的開發伺服器)，您可能需要安裝一些開發依賴：

```bash
npm install
# 或
yarn install
```
(如果您的 `package.json` 尚未包含 Vite 等開發工具，您可以手動添加它們，請參考下一步。)

### 5. 啟動本地開發伺服器 (Running Locally)

由於專案使用 TypeScript (TSX 檔案) 並且依賴 `process.env.API_KEY`，我們強烈建議使用一個支援這些功能的本地開發伺服器，例如 **Vite**。

*   **安裝 Vite (如果尚未安裝):**
    ```bash
    npm install -D vite @vitejs/plugin-react dotenv
    # 或
    yarn add -D vite @vitejs/plugin-react dotenv
    ```
    (已加入 `dotenv` 套件以便 `vite.config.js` 讀取 `.env` 檔案)

*   **建立 Vite 設定檔:**
    在專案根目錄建立一個名為 `vite.config.js` (或 `vite.config.ts`) 的檔案，並填入以下內容：

    ```javascript
    // vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import dotenv from 'dotenv';

    // 讀取 .env 檔案
    dotenv.config();

    export default defineConfig({
      plugins: [react()],
      // 讓 API_KEY 能在前端程式碼中透過 process.env.API_KEY 讀取
      // Vite 會自動從 .env 檔案載入環境變數給 Node.js 環境
      // 但要曝露給瀏覽器端，需要明確 define
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
      },
      server: {
        port: 3000, // 可選，設定服務埠號
        open: true    // 可選，自動在瀏覽器開啟
      }
    });
    ```

*   **執行 Vite:**
    在您的 `package.json` 的 `scripts` 中加入：
    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    }
    ```
    然後執行：
    ```bash
    npm run dev
    # 或
    yarn dev
    ```
    Vite 將會啟動一個本地開發伺服器 (通常在 `http://localhost:3000`)，並自動處理 `index.html`、編譯 TSX 檔案以及載入環境變數。

如果您選擇使用其他簡易的靜態伺服器 (例如 `npx serve .`)，請注意 `process.env.API_KEY` 可能無法直接在瀏覽器端被讀取，這會導致呼叫 Gemini API 失敗。

## ☁️ 部署至 Vercel (Deployment to Vercel)

Vercel 提供了一個簡單快捷的方式來部署此類前端應用程式。

1.  **註冊/登入 Vercel:** 前往 [Vercel 官網](https://vercel.com/) 並使用您的 GitHub、GitLab 或 Bitbucket 帳號登入。
2.  **匯入專案 (Import Project):**
    *   在 Vercel Dashboard 中，點擊 "Add New..." -> "Project"。
    *   選擇 "Continue with Git" 並連接到您的 GitHub (或其他) 帳戶，然後選擇包含此專案的儲存庫。
3.  **設定專案 (Configure Project):**
    *   **Project Name:** Vercel 會自動產生，您可以自行修改。
    *   **Framework Preset:** Vercel 通常能自動偵測為 "Vite"。如果沒有，請選擇 "Vite"。
    *   **Build and Output Settings:**
        *   **Build Command:** Vercel 通常會自動填入 `vite build` 或 `npm run build`。如果空白，請填入 `npm run build` (假設您已在 `package.json` 中設定了 Vite 的 build script)。
        *   **Output Directory:** Vite 預設是 `dist`。Vercel 通常也能自動偵測。
    *   **Environment Variables (非常重要):**
        *   展開 "Environment Variables" 區塊。
        *   新增一個環境變數：
            *   **Name:** `API_KEY`
            *   **Value:** 貼上您的 Google Gemini API 金鑰。
4.  **部署 (Deploy):** 點擊 "Deploy" 按鈕。Vercel 將會建置並部署您的應用程式。
5.  **完成:** 部署完成後，Vercel 會提供您一個公開的 URL，您可以將其更新到本 README 的 "Live Demo" 區塊。

## 📁 專案結構 (Project Structure)

```
.
├── components/                 # React UI 元件
│   ├── ChatInput.tsx           # 聊天輸入框元件
│   └── ChatMessage.tsx         # 聊天訊息顯示元件
├── services/                   # 外部服務相關 (例如 API 呼叫)
│   └── geminiService.ts        # 與 Gemini API 互動的邏輯
├── App.tsx                     # 主要的 React 應用程式元件
├── constants.ts                # 專案常數 (例如 AI 模型名稱)
├── index.html                  # HTML 入口檔案，包含 Tailwind CSS 與 import maps 設定
├── index.tsx                   # React 應用程式的進入點
├── localization.ts             # 多語言內容與 Artie 核心行為指令
├── metadata.json               # 應用程式的元數據 (名稱、描述等)
├── types.ts                    # TypeScript 型別定義
├── .env                        # (本地環境變數，不應上傳到 Git)
├── .env.example                # 環境變數範例檔案 (可選，建議包含)
├── vite.config.js              # (如果使用 Vite) Vite 設定檔
├── package.json                # 專案依賴與腳本
└── README.md                   # 您正在閱讀的檔案
```

## 🎨 客製化 Artie (Customizing Artie)

您可以輕鬆調整 Artie 的個性、說話風格以及它如何回應特定情況：

*   **Artie 的核心行為與多語言內容設定檔:** `localization.ts`
    *   **系統指令 (System Instruction):** 在 `localization.ts` 檔案中，您可以找到每個語言版本 (例如 `translations[Language.ZH_TW]`) 對應的 `artieSystemInstruction` 字串。這是給予 Gemini API 的核心指令，詳細描述了 Artie 的角色、個性特點（例如幽默、禮貌）、互動方式、以及如何處理未知問題等。您可以修改對應語言的此字串，來賦予 Artie 不同的行為模式或知識領域。
    *   **歡迎訊息 (Welcome Message):** 同樣在 `localization.ts` 中，每個語言版本的 `artieWelcome` 字串定義了 Artie 的初始歡迎語。您可以修改這些訊息以符合您的需求。
    *   **其他本地化字串:** `localization.ts` 還包含了應用程式中所有其他 UI 文字，如按鈕標籤、提示訊息等。

*   **AI 模型設定檔:** `constants.ts`
    *   **模型名稱 (Model Name):** `GEMINI_MODEL_NAME` 變數位於 `constants.ts` 檔案中，指定了目前應用程式使用的 Gemini 模型。如果您想更換模型，可以在此處修改。

## 🤝 貢獻 (Contributing)

歡迎各種形式的貢獻！如果您有任何建議、發現錯誤或想新增功能，請隨時提出 Issue 或發送 Pull Request。

1.  Fork 本專案。
2.  建立您的特性分支 (`git checkout -b feature/AmazingFeature`)。
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4.  推送至分支 (`git push origin feature/AmazingFeature`)。
5.  開啟一個 Pull Request。

## 📄 授權 (License)

本專案採用 MIT 授權。詳情請見 `LICENSE` 檔案 (如果專案中包含)。
(如果您尚未加入 LICENSE 檔案，可以考慮新增一個，例如 MIT License，它是一種寬鬆的開源授權。)

---

希望這份 README 對您有所幫助！祝您使用愉快！
