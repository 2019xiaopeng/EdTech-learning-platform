# EdTech Learning Platform

一个基于 Next.js App Router 的 AI 教育学习平台。  
核心流程是：上传试卷图片或 PDF -> 阿里云读光 OCR 切题识别 -> DeepSeek 结构化题目 -> 分屏工作台中完成知识讲解、苏格拉底式答疑与相似题生成。

## 1. 功能概览

- 上传试卷（图片 / PDF）
- PDF 自动提取首页转图片
- 阿里云 OCR `RecognizeEduPaperCut` 切题识别
- DeepSeek 将 OCR 文本结构化为题目 JSON
- 左侧原卷坐标框选题，右侧题目解析与交互
- 支持 AI 知识点讲解、苏格拉底对话、举一反三
- 支持 LaTeX 数学公式渲染（Markdown + KaTeX）

## 2. 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript
- Zustand（全局状态）
- shadcn/ui + Tailwind CSS
- react-markdown + remark-math + rehype-katex
- 阿里云 OCR 官方 SDK：`@alicloud/ocr-api20210707`
- DeepSeek（硅基流动接口）
- sonner（Toast 提示）

## 3. 项目结构

```text
src/
  app/
    page.tsx                      # 上传入口页
    workspace/[id]/page.tsx       # 分屏学习工作台
    api/
      ocr/recognize/route.ts      # OCR切题路由
      paper/process/route.ts      # 试卷处理编排路由
      ai/chat/route.ts            # 苏格拉底式对话
      ai/knowledge/route.ts       # 知识点讲解
      ai/similar/route.ts         # 相似题生成
  lib/
    pdf.ts                        # PDF转图片
    server/
      aliyun-ocr.ts               # OCR SDK封装与解析
      deepseek.ts                 # DeepSeek封装
  services/api.ts                 # 前端 fetch 请求封装
  store/useWorkspaceStore.ts      # Zustand状态管理
  types.ts                        # 业务类型定义
```

## 4. 环境变量

请在本地创建 `.env.local`，并按以下模板填写：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
ALIYUN_OCR_ACCESS_KEY_ID=your_access_key_id
ALIYUN_OCR_ACCESS_KEY_SECRET=your_access_key_secret
ALIYUN_OCR_REGION=cn-hangzhou
```

说明：

- `DEEPSEEK_API_KEY` 仅在服务端 API Route 使用
- 不要把真实密钥提交到仓库
- `.gitignore` 已忽略 `.env*` 与 `.enc*`（保留 `.env.example`）

## 5. 本地开发

```bash
npm install
npm run dev
```

默认启动地址：`http://localhost:3000`

## 6. 生产构建

```bash
npm run build
npm run start
```

## 7. API 路由说明

### `POST /api/ocr/recognize`

请求体：

```json
{
  "imageBase64": "data:image/png;base64,...",
  "subject": "Math"
}
```

作用：调用阿里云 OCR 切题接口，返回原始片段及基础结构化结果。

### `POST /api/paper/process`

请求体：

```json
{
  "imageBase64": "data:image/png;base64,...",
  "subject": "Math"
}
```

作用：编排完整处理流程（OCR -> DeepSeek 结构化 -> 返回 `paper`）。

### `POST /api/ai/chat`

作用：苏格拉底式答疑，返回 `message` 与可选 `options`。

### `POST /api/ai/knowledge`

作用：生成题目核心知识点讲解。

### `POST /api/ai/similar`

作用：生成 2 道相似题及解析。

## 8. 前端数据流

1. 首页上传文件并转为 Base64
2. 调用 `/api/paper/process`
3. 返回 `paper` 后写入 Zustand
4. 跳转 `/workspace/[id]` 渲染题框与题目内容
5. 对话和动作按钮分别调用 AI 路由并实时更新界面

## 9. 安全建议

- 已检测到你本地存在明文密钥文件，请立即确认未被提交并建议尽快轮换密钥
- 生产环境建议改用阿里云 RAM 子账号最小权限策略
- 建议在服务端增加限流与签名校验，避免接口滥用

## 10. 后续可扩展方向

- OCR 结果缓存与任务队列
- 题目知识图谱标签化
- 多轮会话持久化（数据库）
- 班级/教师端批量试卷分析
