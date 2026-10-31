# AI-Resistance Analyst

Персональная платформа для прокачки навыков системного аналитика, которые сложно автоматизировать ИИ: переговоры, работа с неопределённостью, архитектура, доменная экспертиза (banking), AI-augmented workflows.

**Бюджет: $0** — Astro (static) + GitHub Pages + [OpenRouter](https://openrouter.ai) free models + localStorage.

Репозиторий: [minovs205-cyber/school_smart_analyst](https://github.com/minovs205-cyber/school_smart_analyst)

## Стек

- [Astro](https://astro.build) + React islands + TypeScript (strict)
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- localStorage для прогресса (один пользователь)
- [OpenRouter API](https://openrouter.ai/keys) (модели `:free`) для LLM
- GitHub Actions → GitHub Pages

## Быстрый старт

```bash
npm install
npm run dev
```

Открой URL из терминала (обычно `http://localhost:4321/school_smart_analyst/`).

```bash
npm run build
npm run preview
```

## OpenRouter API-ключ (бесплатные модели)

1. Зайди на [openrouter.ai/keys](https://openrouter.ai/keys) и создай ключ.
2. Локально: скопируй `.env.example` → `.env` и вставь ключ в `PUBLIC_OPENROUTER_API_KEY` (файл в `.gitignore`).
3. Для GitHub Pages: Settings → Secrets → `OPENROUTER_API_KEY` (подхватывается в Actions как `PUBLIC_OPENROUTER_API_KEY`).
4. Либо в приложении: **Настройки** → вставь ключ → **Сохранить** (`localStorage`).

**Не коммить** `.env` и сам ключ в git. `PUBLIC_*` переменные попадают в клиентский бандл на Pages — для personal MVP это ок, для публичного продукта нет.

Дефолтная модель: `openrouter/free` (роутер актуальных free-моделей: [openrouter.ai/models](https://openrouter.ai/models?q=free)).

Альтернативы: [Groq Free](https://console.groq.com) или локальный [Ollama](https://ollama.com).

## Деплой на GitHub Pages

1. Push в `main` (remote уже: `minovs205-cyber/school_smart_analyst`).
2. Settings → **Pages** → Source: **GitHub Actions**.
3. Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) соберёт сайт.

Сайт: `https://minovs205-cyber.github.io/school_smart_analyst/`

## Модули

| Маршрут | Модуль | Статус |
|---------|--------|--------|
| `/` | Home | готов (Шаг 1) |
| `/scorecard` | AI-Resistance Scorecard | каркас → Шаг 2 |
| `/cases` | Сложные кейсы | каркас → Шаг 3 |
| `/workflows` | AI-Augmented Workflows | каркас → Шаг 4 |
| `/domain` | Доменная экспертиза | каркас → Шаг 5 |
| `/soft-skills` | Soft Skills & Negotiation | каркас → Шаг 6 |
| `/journal` | Рефлексия | каркас → Шаг 7 |
| `/settings` | OpenRouter API-ключ | готов (Шаг 1) |

Контент Markdown: [`src/content/`](src/content/).

## localStorage-ключи

- `skills_score` — оценки навыков
- `journal_entries` — журнал рефлексии
- `case_notes` — заметки по кейсам
- `llm_api_key` — API-ключ OpenRouter
- `settings` — тема и предпочтения
