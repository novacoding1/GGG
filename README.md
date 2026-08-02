# 🌳 Шежіре Builder (Kazakh Genealogical Tree Builder)

**Шежіре Builder** — современное, высокопроизводительное веб-приложение для создания и редактирования интерактивного генеалогического древа казахского народа с неограниченной глубиной потомков, поддержкой 10 000+ узлов, Apple-style Glassmorphic дизайном и автосохранением.

---

## ✨ Ключевые особенности

- 🌟 **Начальный экран**: Начинается с красивого главного круга **"Алаш"** и центральной кнопки `+`.
- ⚡ **Бесконечное дерево**: Клик по `+` автоматически создает потомка, связывая их извилистой линией 3px.
- 🎨 **Apple Glassmorphism UI**: Очень плавные 60fps анимации, микро-анимации hover, красивое свечение и современные шрифты (`Inter` & `Outfit`).
- 🛡️ **Поддержка Жузов и Родов**:
  - Ұлы жүз (Старший жуз) — Зеленый акцент (`#10B981`)
  - Орта жүз (Средний жуз) — Синий акцент (`#3B82F6`)
  - Кіші жүз (Младший жуз) — Красный акцент (`#EF4444`)
  - Жүзден тыс — Фиолетовый акцент (`#8B5CF6`)
- 🔍 **Поиск и Фильтрация**: Поиск по имени, роду, годам жизни, описанию, а также быстрая фильтрация по жузам и полу.
- 🖱️ **Управление Canvas**:
  - Zoom (колесиком), Drag/Pan мышью
  - Миникарта, Центрирование, Во весь экран
  - Горизонтальная / Вертикальная авторасстановка (Dagre algorithm)
  - Горячие клавиши: `Ctrl+Z` (Undo), `Ctrl+Y` (Redo), `Delete` (Удалить), `Ctrl+C` (Копировать), `Ctrl+V` (Вставить).
- 🖱️ **Контекстное меню (ПКМ)**: Добавить потомка, Добавить брата, Редактировать, Удалить, Изменить цвет, Дублировать.
- 💾 **Автосохранение & Offline mode**: Автоматическое сохранение каждые 5 секунд в LocalStorage с защитой данных.
- 📤 **Экспорт**: PNG, SVG, PDF, JSON, Excel / CSV, Печать.
- 📥 **Импорт**: Загрузка JSON, Excel и CSV файлов.
- 🌐 **Мультиязычность**: Қазақша, Русский, English (переключение на лету без перезагрузки).
- 🗄️ **Supabase Backend Ready**: Полная SQL миграция (`src/supabase/schema.sql`) с RLS политиками безопасности.

---

## 🚀 Быстрый запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

---

## 📁 Архитектура проекта (Feature-Sliced Design)

```
shezhire-builder/
├── public/              # Статические ассеты и favicon
├── src/
│   ├── app/             # Корневой монтирующий компонент, index.css, main.tsx
│   ├── entities/        # Модели данных (node.types.ts, tree.types.ts, user.types.ts)
│   ├── features/        # Модули бизнес-логики:
│   │   ├── canvas/      # React Flow custom nodes, context menu, layout engine
│   │   ├── editor/      # Glassmorphic Node Edit Modal
│   │   ├── filter/      # Поиск и панель фильтрации
│   │   ├── export-import/ # Экспорт (PNG/SVG/PDF/JSON/Excel) и Импорт
│   │   ├── auth/        # Профиль пользователя и форма авторизации
│   │   └── i18n/        # Языковые пакеты (kk, ru, en)
│   ├── shared/          # Хелперы, константы, Zustand сторы
│   │   ├── constants/   # Начальное шежире казахских родов
│   │   ├── lib/         # Dagre layout & export utils
│   │   ├── store/       # Zustand state management (treeStore, authStore)
│   │   └── ui/          # Header, CanvasToolbar
│   └── supabase/        # SQL схема базы данных и RLS правила
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🛠️ Стек технологий

- **React 18 / 19** & **TypeScript**
- **Vite 6**
- **TailwindCSS** (Apple dark/light glassmorphic UI)
- **@xyflow/react** (React Flow)
- **Dagre** (Авторасстановка графа)
- **Framer Motion** & **Canvas-Confetti**
- **Zustand 5**
- **i18next** & **react-i18next**
- **html-to-image**, **jspdf**, **xlsx**
- **Supabase PostgreSQL**
