# Backend Structure

This document outlines the file and folder structure of the backend application.

```
backend/
├── src/
│   ├── ai/
│   │   ├── ai.module.ts
│   │   └── ai.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth/
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── chat/
│   │   ├── chat.controller.spec.ts
│   │   ├── chat.controller.ts
│   │   ├── chat.gateway.spec.ts
│   │   ├── chat.gateway.ts
│   │   ├── chat.module.ts
│   │   ├── chat.service.spec.ts
│   │   ├── chat.service.ts
│   │   └── entities/
│   │       ├── conversation-member.entity.ts
│   │       ├── conversation.entity.ts
│   │       ├── message-reaction.entity.ts
│   │       ├── message-receipt.entity.ts
│   │       ├── message.entity.ts
│   │       └── pinned-message.entity.ts
│   ├── data-source.ts
│   ├── documents/
│   │   ├── document.controller.ts
│   │   ├── document.service.ts
│   │   ├── documents.module.ts
│   │   └── entities/
│   │       └── document.entity.ts
│   ├── main.ts
│   ├── migrations/
│   │   ├── 1773327230044-init.ts
│   │   ├── 1773406899073-add-search-index.ts
│   │   ├── 1773408254629-AddSearchTrigger.ts
│   │   ├── 1773675346204-add-message-reactions.ts
│   │   ├── 1773675978670-add-pinned-messages.ts
│   │   └── 1773677189527-add-documents.ts
│   ├── redis-adapter.ts
│   ├── storage/
│   │   └── storage.service.ts
│   └── users/
│       ├── entities/
│       │   └── user.entity.ts
│       ├── users.module.ts
│       ├── users.service.spec.ts
│       └── users.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .gitignore
├── README.md
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
├── venv/
│   └── pyvenv.cfg
└── ws-test.js
```</content>
<parameter name="filePath">backend_structure.md