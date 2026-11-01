# Bek Mebel — deployment preflight

Дата проверки: 2026-11-01 (UTC). **Результат: BLOCKED.** Production source и ветка для `https://bek-mebel.kz` не подтверждены.

## GitHub Pages и Actions

| Репозиторий | Настройки Pages на момент проверки | Последний найденный успешный Pages run |
| --- | --- | --- |
| [bek-mebel](https://github.com/Murkin1980/bek-mebel) | `main`, `/`, legacy; custom domain не задан; URL `https://murkin1980.github.io/bek-mebel/` | [run 35680726581](https://github.com/Murkin1980/bek-mebel/actions/runs/35680726581), `main`, `f93caeb5d643f3ec53a429a464595d9a1e0dacd1`; deployment 6582312635 — success, environment URL GitHub Pages |
| [bek-mebel-3](https://github.com/Murkin1980/bek-mebel-3) | `has_pages=false`, Pages API вернул 404; текущие настройки публикации отсутствуют | Исторический [run 29119868563](https://github.com/Murkin1980/bek-mebel-3/actions/runs/29119868563), `main`, `cfeb35dac472756dd4ac3ed7e6fa7cfda27ba840`; исторический deployment не доказывает текущую публикацию |
| [bek-mebel-v2](https://github.com/Murkin1980/bek-mebel-v2) | `gh-pages`, `/`, legacy; custom domain не задан; URL `https://murkin1980.github.io/bek-mebel-v2/`; default branch `master` | [run 26432327786](https://github.com/Murkin1980/bek-mebel-v2/actions/runs/26432327786), `gh-pages`, `ab29451500e7f15b013bfd9593af0fdcaf89e5e4` |

Для всех трех Actions API показывает динамический workflow `pages-build-deployment`; обнаружены только environment `github-pages` и исторические deployments этой среды. В дереве default branch каждого репозитория нет файлов `.github/workflows`, `CNAME`, `vercel.json`, `netlify.toml` или `wrangler.toml`. Это не исключает внешнюю настройку хостинга или ручную публикацию. Источники: GitHub REST API `repos/{owner}/{repo}`, `/pages`, `/actions/workflows`, `/actions/runs`, `/deployments`, `/environments`, `/git/trees/HEAD?recursive=1`.

## DNS и содержимое

- Резолвер окружения вернул для `bek-mebel.kz` и `www.bek-mebel.kz` адреса `194.39.65.25` и `2a00:5da0:1000::167`; для `murkin1980.github.io` — `185.199.108.153`–`185.199.111.153` и `2606:50c0:8000::153`–`2606:50c0:8003::153`. Это наблюдение адресов, а не подтверждение владельца сервера или способа деплоя.
- Просмотр [production](https://bek-mebel.kz/) через внешний fetch показал заголовок «Кухни и шкафы на заказ в Алматы», текст «Расчет стоимости в WhatsApp за 10 минут» и изображение `assets/kitchen-15-01.jpg`. Те же заметные элементы присутствуют на [Pages bek-mebel](https://murkin1980.github.io/bek-mebel/) и в `index.html` default branch `bek-mebel-3`. [Pages v2](https://murkin1980.github.io/bek-mebel-v2/) показывает другой главный заголовок и пути к изображениям. Сходство содержимого не доказывает, какой репозиторий или ветка автоматически публикуют домен.
- Прямой `curl` из sandbox к домену завершился `SSL_ERROR_SYSCALL`; среда ограничивает исходящие подключения. Fetch предоставил извлеченный текст, а не сырой HTML или заголовки ответа; побайтовая сверка не выполнялась.

## Блокировка и дальнейшее действие

Ни одна из проверенных конфигураций GitHub Pages не назначает `bek-mebel.kz` custom domain, а DNS не совпадает с наблюдаемыми адресами GitHub Pages. Внешний хостинг, reverse proxy или ручное копирование не исключены. Нужны доступные только владельцу настройки реального хостинга/деплоя: домен и origin, связанный репозиторий, ветка и последний deployed commit либо проверяемый лог деплоя. После подтверждения можно продолжить CP-AI-SEARCH-01 в соответствующем репозитории по его утвержденной спецификации.

Код, DNS, домены и настройки деплоя не изменялись; merge и deploy не выполнялись.
