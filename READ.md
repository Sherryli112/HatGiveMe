## 系統簡介


## Built With
- Node.js (v22-alpine)
- PostgreSQL (v15-alpine)
- Next.js (v14 App Router)
- NestJS (v10+)
- Prisma (v5.22.0)
- Docker Compose

## 部署
### 使用 Docker Compose
1. 確保已安裝 [Docker](https://docs.docker.com/engine/) 和 [Docker Compose](https://docs.docker.com/compose/install/)。
2. 於專案根目錄建立 .env 檔案，內容如下：
   ```env
   DATABASE_USER=admin
   DATABASE_PASSWORD=hat1234
   DATABASE_NAME=hatgiveme
   DATABASE_PORT=5435
   BACKEND_PORT=8100
   FRONTEND_PORT=8000
   ```
3. 在專案根目錄下執行以下命令啟動服務：
    ```shell
    docker compose up -d --build
    ```
   3.1. 若要個別部署服務，可以使用以下命令：
    - 指令
        ```shell
        docker compose up -d --build <service>
        ```
    - 範例： 部署 Frontend (Next.js)
        ```shell
        docker compose up -d --build frontend
        ```
4. 資料表建立：  
    4.1. 進入 backend container
    ```shell
    docker exec -it hatgiveme_backend sh
    ```
    4.2. 執行資料庫遷移 (Migration)
     ```shell
    npx prisma migrate dev --name init
    ```

### 手動部署 (Local) 
#### Backend (NestJS)
1. 切換至 backend 路徑
     ```shell
    cd ./backend
    ```
2. 安裝套件
    ```shell
    npm install
    ```
3. 於專案根目錄建立 .env 檔案，內容如下：
   ```env
   DATABASE_URL="postgresql://admin:hat1234@localhost:5435/hatgiveme?schema=public"
   JWT_SECRET="fba87ec213d=@wop"
   API_KEY="hat1234"
   ```
4. 資料庫設定  
   4.1. 產生 Prisma Client
    ```shell
    npx prisma generate
    ```
   4.2. 資料庫遷移
    ```shell
    npx prisma migrate dev
    ```
5. 啟動 NestJS  
   5.1. 開發模式
    ```shell
    npm run start:dev
    ```

#### Frontend (Next.js)
1. 切換至 frontend 路徑
    ```shell
    cd ./frontend
    ```
2. 安裝套件
    ```shell
    npm install
    ```
3. 於專案根目錄建立 .env 檔案，內容如下：
   ```shell
   NEXT_PUBLIC_API_URL=http://localhost:8100
   ```
4. 啟動 Next.js  
    4.1. 開發模式
    ```shell
    npm run dev
    ```

## 系統連線資訊
啟動後，各服務預設入口如下：

| 服務 | URL | 說明 |
| :--- | :--- | :--- |
| **Frontend** | http://localhost:8000 | 前端頁面 |
| **Backend API** | http://localhost:8100/api/docs | Swagger 文件 |
| **PostgreSQL** | localhost:5435 | 資料庫連線 |