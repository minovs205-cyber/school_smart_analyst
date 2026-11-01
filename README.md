# school_smart_analyst

**Антихрупкий системный аналитик** — инженерная платформа для практикующих SA: делегирование рутины ИИ, неопределённость, архитектура и стейкхолдеры (банк / регуляторика).

Модули профессионального роста + **AI-диагностика**; наставник — ИИ. [`src/data/curriculum.ts`](src/data/curriculum.ts), UI: `/program`, `/scorecard`.

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
5. Опционально: `PUBLIC_CAL_URL` — твоя ссылка Cal.com для `/consultations`.
6. Партнёрские URL: правь [`src/lib/partners.ts`](src/lib/partners.ts) (UTM добавляются сами).

**Не коммить** `.env` и сам ключ в git. `PUBLIC_*` переменные попадают в клиентский бандл на Pages — для personal MVP это ок, для публичного продукта нет.

Дефолтная модель: `openrouter/free` (роутер актуальных free-моделей: [openrouter.ai/models](https://openrouter.ai/models?q=free)).

Альтернативы: [Groq Free](https://console.groq.com) или локальный [Ollama](https://ollama.com).

## Деплой на GitHub Pages

1. Push в `main` (remote уже: `minovs205-cyber/school_smart_analyst`).
2. Settings → **Pages** → Source: **GitHub Actions**.
3. Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) соберёт сайт.

Сайт: `https://minovs205-cyber.github.io/school_smart_analyst/`

## Модули и программа

| Маршрут | Модуль | Статус |
|---------|--------|--------|
| `/` | Главная + квест на сегодня | готов |
| `/program` | Программа L1–L6 (JavaRush-стиль) | готов |
| `/scorecard` | Карта навыков | готов |
| `/cases` | Кейсы + ИИ-наставник | готов |
| `/workflows` | Сценарии с ИИ | stub |
| `/domain` | Домен банка | stub |
| `/soft-skills` | Переговоры | stub |
| `/journal` | Журнал | готов |
| `/consultations` | Консультации (Cal.com CTA) | готов |
| `/settings` | Ключ OpenRouter | готов (noindex) |
| `/sitemap.xml` | Sitemap | готов |
| `/robots.txt` | Robots | готов |

Коммерческий фундамент: OG/canonical, партнёрские слоты (`src/lib/partners.ts`), шаринг карты, футер.

Контент Markdown: [`src/content/`](src/content/).

## localStorage-ключи

- `skills_score` — оценки навыков
- `journal_entries` — журнал рефлексии
- `case_notes` — заметки по кейсам
- `curriculum_progress` — закрытые квесты программы
- `llm_api_key` — API-ключ OpenRouter
- `settings` — тема и предпочтения
