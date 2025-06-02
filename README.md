# 📊 Market Master

Market Master 是一个用于金融交易模拟和图表分析的 Web 应用程序。它提供了强大的技术分析工具、实时交易模拟以及回测功能，适用于股票、期货等金融资产的可视化与策略测试。

## 🧩 项目特点

- **交互式图表**：使用 Lightweight-Charts 实现专业级 K 线图绘制。
- **技术指标支持**：包括 EMA、MACD、MA 等常用技术分析指标。
- **交易模拟**：支持开仓、平仓、止损止盈等模拟交易操作。
- **回测系统**：可记录并重放历史交易行为，辅助策略优化。
- **响应式 UI**：采用 Radix UI 和 Tailwind CSS 构建美观且一致的界面。
- **键盘快捷键**：支持 L/V/O/C/Delete/Esc 等快捷键操作。
- **暗黑模式支持**：通过 `next-themes` 实现主题切换。

## 🛠️ 技术栈

### 前端框架

- **Next.js 14**
- **React 18**
- **Redux Toolkit + Redux DevTools**
- **Framer Motion**（动画）
- **Tailwind CSS + Tailwind Animate**
- **Radix UI 组件库**

### 图表与数据处理

- **Lightweight-Charts**（K 线图渲染）
- **Zod**（表单验证）
- **Immer**（不可变状态更新）
- **MathJS / Big.js**（高精度数学计算）

### 网络请求与数据持久化

- **Axios**（HTTP 请求）
- **JWT Decode**（身份认证）
- **Cookie/LocalStorage 工具类**

### 开发工具

- **TypeScript**
- **ESLint + Prettier**
- **Jest + React Testing Library**
- **Sonner**（通知提示）
- **Hotkeys-JS**（快捷键绑定）

## 📁 目录结构概览

```
.
├── app/                  # Next.js App Router 页面
│   ├── auth/               # 登录/注册页面
│   ├── dashboard/          # 控制面板
│   ├── playground/         # 核心交易模拟页面
│   └── ...
├── components/             # 可复用组件
│   ├── ui/                 # 基础 UI 组件（按钮、对话框等）
│   ├── interfaces/         # 图表组件接口定义
│   ├── playground/         # Playground 区域组件（侧边栏、控制面板等）
│   └── ...
├── store/                  # Redux 状态管理
├── hooks/                  # 自定义 Hook（绘图、事件绑定等）
├── utils/                  # 工具函数（API 封装、Excel 导出等）
├── constants/              # 静态常量（配置项）
├── providers/              # Context Providers（Theme、Store、EventEmitter）
└── README.md
```

## 🔧 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动构建后的服务
npm run start
```

访问 [http://localhost:7777](http://localhost:7777) 查看本地开发环境。

## 🧪 测试

```bash
# 运行单元测试
npm run test
```

## 📦 依赖列表（部分）

- `next`, `react`, `redux`, `lightweight-charts`
- `tailwindcss`, `radix-ui/react-*`
- `zod`, `immer`, `axios`, `jwt-decode`
- `mathjs`, `big.js`, `dayjs`, `date-fns`

完整依赖请查看 `package.json` 文件。

## 📜 许可证

本项目使用 MIT 许可证。
