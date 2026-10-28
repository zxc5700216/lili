# 本地运行

在解压后的项目目录里执行：

```bash
cp .env.example .env
docker compose up -d
npm i
npx prisma db push
npx prisma db seed
npm run dev
```

浏览器打开 http://127.0.0.1:43123

登录页点一次即可进入。Postgres 映射在本机 `54329`。数据是模拟的，不会连接亚马逊。
