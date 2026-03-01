# 🎮 Quick Start - 一键运行游戏

## 最简单的运行方式

### Linux / macOS:
```bash
./play.sh
```

### Windows:
```cmd
play.bat
```

双击或在终端运行即可！

## 它会做什么？

1. ✅ 自动检查依赖是否安装
2. ✅ 首次运行时自动安装 npm 包
3. ✅ 启动开发服务器
4. ✅ 游戏运行在 `http://localhost:5173`

## 游戏操作

- **移动**: 方向键 或 WASD
- **暂停**: P 或 ESC
- **开始游戏**: ENTER 或 点击

## 游戏特色

- 🎯 7个难度递增关卡
- 💥 粒子效果和屏幕震动
- ⚡ 连击倍数系统（最高3x）
- 🏆 全局排行榜
- 🌊 随机波次事件（金币雨/障碍波）
- 🎨 霓虹赛博朋克风格

## 手动运行（如果需要）

```bash
cd frontend
npm install
npm run dev
```

## 构建生产版本

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist/` 目录。

## 部署到 Vercel

这个项目已配置好 Vercel 部署：
- 前端自动构建
- 后端 API 运行在 `/api/*`
- 一键导入到 Vercel 即可

---

**祝你玩得开心！** 🚀
