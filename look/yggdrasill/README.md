# Yggdrasill 
Yggdrasill 的職責為 socket gateway，主要負責 client 與 server 間的 websocket 連線 (穩路不穩時會自動 downgrade 成 polling mode)，以 Node.js 的 express framework 搭配 Socket.io 撰寫。

## Project Structure
- `build`
    - 放置 generate protobuf 所需要的 binary，根據 Makefile 所指定的版本去抓對應的 binary 到這邊，編譯出對應的 javascript proto codes 到指定的資料夾
- `client`
    - 放 Local 測試時使用的 GUI 程式碼
- `src/builds`
    - 放置由 protobuf 編譯好的 javascript proto codes
- `src/datasources`
    - 放置所有外部資料來源的程式碼，其中包括快取、資料庫或是內部其他服務如 gravitas、portiere 
- `src/middleware`
    - 放置所有 socket.io 會用到的業務邏輯，其中包括驗證 (auth)、聊天 (chat) 及初始化 (init) 等模組，並在 app.js 裡面作依賴引用
- `src/proto`
    - 放置 google 在使用的內部 proto，透過 protobuf 編譯出對應的檔案後，可以拿來判斷 gRPC 回傳的 detail 資訊去判斷 application error code
- `src/public`
    - 放置一些 debug 用的靜態檔案，主要是拿來簡單偵錯一些 socket API
- `src/utils`
    - 放置可以共用的一些程式碼，例如使用自訂 error code、自訂 log format 等共用邏輯
- `src/app.js`
    - application 進入點，其中包括 socket.io 的設定、graceful shutdown 的一些核心邏輯
- `src/config.js`
    - application 用到的所有 default config 資訊，若有需要再透過 env. 進行注入替換
- `src/logger.js`
    - application 用到的 log 設定，包括使用的套件及 threshold

## Getting Started
開發使用 Node.js 12.16.1 （ Docker 也使用此版本），建議透過 nvm 等 Node.js 版本管理套件輔助：

```bash
# 先安裝 nvm
$ brew install nvm
```

這邊安裝完還會需要設置環境變數，請參考 brew 安裝後的提示，設定完成後就可以安裝 Node.js ：

```bash
# 安裝指定版本 Node.js ，這也會一併安裝對應的 npm （ Node.js 套件管理）
$ nvm install 12.16.1
```

專案透過 Protobuf 來定義與 Client 端溝通的結構，所以 Clone 完之後還得先更新 rocks （所有專案使用的 Protobuf 定義）：

```bash
# 初始化（更新） rocks
$ git submodule update --recursive --init

# 產生對應 Protobuf 的 .js 檔案
$ make gen-protoc
```

接著還得準備 Yggdrasill 所依賴的三方服務：
- redis cluster
- memcached

這些三方服務建議使用 docker ：
```bash
# 啟動 Redis Cluster
$ docker run -d --name redis -e 'IP=0.0.0.0' -e CLUSTER_ONLY=true -p 6379:6379 -p 7000-7005:7000-7005 grokzen/redis-cluster:latest

# 啟動 Memcached
$ docker run -d --name memcached -p 11211:11211 memcached
```

之後就可以直接執行 Makefile 指令來啟動專案：

```bash
$ make run
```

## API References
請參考[這裡](./api-doc.md)。
