---
title: Яндекс Вордстат
description: Как подключить Яндекс Вордстат, чем ключ Палитры отличается от своего ключа и что умеет агент.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/yandex_wordstat/vendor_manifest.yaml
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/manifest.yaml
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/extractor.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_account.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_errors.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_client.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_batch.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/_base.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/get_top_requests.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/get_query_dynamics.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/get_regions_distribution.py
  - palitra-backend/src/connectors/_base/errors.py
  - palitra-backend/src/modules/connector_registry/application/services/platform_credential.py
  - palitra-backend/src/modules/connector_registry/application/services/connector_service.py
  - palitra-backend/src/modules/connector_registry/application/services/tool_registry.py
  - palitra-backend/src/modules/billing/domain/models/feature_matrix.py
  - palitra-backend/src/modules/billing/application/services/platform_usage_warning.py
  - palitra-backend/src/modules/notifications/infrastructure/i18n/catalog/ru.json
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/lib/connectors/platform-key.ts
  - palitra-frontend/lib/connectors/connect-settings.ts
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/connector-setup/wizard.tsx
  - palitra-frontend/components/connector-setup/wizard.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/platform-key-choice.tsx
  - palitra-frontend/components/connector-setup/steps/platform-key-choice.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.ru.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.ru.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.ru.messages.json
  - palitra-frontend/components/connectors/catalog-list.tsx
  - palitra-frontend/components/connectors/catalog-list.ru.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.tsx
  - palitra-frontend/components/connectors/catalog-connector-card.ru.messages.json
  - palitra-frontend/components/layout/app-sidebar.ru.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.tsx
  - palitra-frontend/components/connectors/connected-connector-card.ru.messages.json
  - palitra-frontend/components/connectors/connector-key-line.ru.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.ru.messages.json
  - palitra-frontend/components/billing/usage-card.tsx
  - palitra-frontend/components/billing/usage-card.ru.messages.json
---

Коннектор Яндекс Вордстата даёт агенту данные о поисковом спросе: сколько раз ищут фразу, какие
запросы ищут вместе с ней, как спрос меняется со временем и в каких регионах он выше. Данные в
проект не загружаются: агент запрашивает Вордстат каждый раз, когда ему нужен ответ.

Работать коннектор может на ключе Палитры или на вашем собственном ключе Yandex Cloud.

## Ключ Палитры или свой ключ

- **Ключ Палитры.** Ничего настраивать в Яндексе не нужно. Запросы агента расходуют единицы
  Вордстата из тарифа организации — подробнее ниже. Ключ Палитры есть только в облачной версии
  Палитры; в установке BYOC подключайте свой ключ.
- **Свой ключ Yandex Cloud.** Запросы идут через ваш ключ и не расходуют единицы тарифа
  организации.

Ключ выбирается один раз, при подключении. Позже его не поменять: «Чтобы перейти на свой ключ,
удалите подключение и подключите коннектор заново.» Так же и в обратную сторону — чтобы перейти
со своего ключа на ключ Палитры, удалите коннектор и подключите его снова.

На ключе Палитры в проекте может быть только один коннектор Вордстата. Свой ключ тоже нельзя
подключить в один проект дважды, но другой ключ подключить можно — кнопкой «Подключить ещё».

## Как получить свой ключ

Подсказка в мастере: «Создайте в консоли console.yandex.cloud сервисный аккаунт с ролью
search-api.webSearch.user, выпустите для него API-ключ и вставьте ключ сюда.»

Больше ничего вводить не нужно — только сам ключ.

## Подключение

Коннектор подключается только из раздела «Коннекторы»; в мастере настройки после регистрации
его нет. Общие шаги мастера описаны в [обзоре коннекторов](/connectors/overview/).

1. В боковой панели откройте «Коннекторы» и перейдите на вкладку «Маркетплейс». Вордстат
   находится в категории «Прочее», на карточке — отметка «Исследования».
2. На карточке «Яндекс Вордстат» нажмите «Подключить». Откроется страница «Подключение Яндекс
   Вордстат».
3. **«Авторизация».** Если ключ Палитры доступен, вверху есть блок «Какой ключ использовать»;
   по умолчанию выбран «Ключ Палитры». Под ним видно, сколько единиц уже израсходовано: «В этом
   месяце использовано … из … единиц Вордстата по тарифу организации.»
   - Чтобы работать на ключе Палитры, просто нажмите «Продолжить».
   - Чтобы работать на своём ключе, выберите «Свой ключ Yandex Cloud» и вставьте ключ в поле
     «API-ключ». Если ключ Вордстата уже сохранён в Палитре, можно выбрать существующие учётные
     данные. Владелец и администратор организации могут отметить «Сохранить на уровне
     организации».

   Если блока «Какой ключ использовать» нет, ключ Палитры в этой установке недоступен — сразу
   вставьте свой ключ.

4. **«Разрешения».** Для каждого инструмента агента выберите: «Всегда разрешать», «Требует
   подтверждения» или «Заблокировано».
5. **«Проверка».** Нажмите «Готово». На своём ключе Палитра при подключении проверяет, что
   Вордстат принимает ключ.

Других шагов у Вордстата нет: аккаунт выбирать не нужно, ограничений и автотегирования нет.

## Какие данные загружаются

Никакие. Вордстат не синхронизируется, поэтому на карточке коннектора нет пункта
«Синхронизировать» и строки о последней синхронизации. Вместо этого на карточке написано, на
каком ключе работает коннектор: «Ключ Палитры» или «Ключ: …» с началом и концом вашего ключа.

## Что умеет агент

У Вордстата три инструмента. Все они только читают данные и по умолчанию разрешены всегда.

- **«Популярные запросы»** — по каждой фразе за последние 30 дней: сколько всего запросов с
  ней, самые частые запросы, которые её содержат, и похожие запросы. Все числа — по широкому
  соответствию (фраза в любой словоформе и среди других слов); точной частотности в кавычках
  Вордстат через API не даёт.
- **«Динамика запросов»** — число запросов с фразой и их доля среди всех запросов по месяцам,
  неделям или дням. Даты расширяются до целых периодов, текущий неполный период не входит.
  Данные по дням — только за последние 60 дней.
- **«Спрос по регионам»** — по каждой фразе за последние 30 дней: число запросов в регионе, его
  доля и индекс интереса (100 — средний интерес, выше 100 — выше среднего). Можно смотреть по
  городам, по субъектам или по всем регионам вместе.

За один вызов агент может спросить до 20 фраз. Все три инструмента можно сузить по устройствам:
компьютеры, телефоны, планшеты. «Популярные запросы» и «Динамику запросов» — ещё и по регионам
(по названию или номеру региона в Вордстате).

## Единицы Вордстата на ключе Палитры

На ключе Палитры каждый ответ Вордстата расходует единицы из тарифа организации:

| Инструмент           | Единиц за фразу |
| -------------------- | --------------- |
| «Популярные запросы» | 1               |
| «Динамика запросов»  | 1               |
| «Спрос по регионам»  | 2               |

- Единицы общие для всех проектов организации и обновляются раз в месяц.
- Платят только за фразы, на которые Вордстат ответил. Фраза, которую Вордстат отклонил, или
  запрос, который не удался, единиц не тратит.
- Если единиц не хватает на весь запрос агента, он отклоняется целиком, до обращения к
  Вордстату.
- Счётчик «Единицы Вордстата за месяц» и дата обновления показаны в разделе
  [Оплата](/organization/billing/). Тот же остаток видно на шаге «Авторизация» и в настройках
  коннектора.
- Когда организация израсходует 80 % единиц, владелец и администраторы организации получат
  уведомление «Приближается лимит потребления» — один раз за месяц.

Ключ Палитры работает только при действующей подписке: без подписки, пока подписка не активна
или пока не оплачен просроченный счёт, агент получит отказ. На своём ключе единицы тарифа не
расходуются и эти ограничения не действуют.

## Частые проблемы

**«Ключ не принят Яндексом: он неверный или удалён. Скопируйте ключ заново или выпустите новый
в консоли Yandex Cloud.»** Так мастер отвечает на шаге «Авторизация», если Яндекс не узнал ключ.
Вставьте действующий ключ.

**«У сервисного аккаунта ключа нет роли search-api.webSearch.user. Назначьте её в консоли
Yandex Cloud и попробуйте ещё раз.»** Назначьте роль сервисному аккаунту, которому выпущен ключ,
и нажмите «Готово» ещё раз.

**«Яндекс Вордстат сейчас не отвечает, попробуйте позже.»** Вордстат временно недоступен.
Повторите подключение позже.

**«Ключ Палитры для … сейчас недоступен. Подключите свой ключ.»** Мастер сам переключится на
поле для своего ключа — вставьте ключ Yandex Cloud.

**«Яндекс Вордстат уже подключён в этом проекте…»** Коннектор на ключе Палитры или с этим же
ключом уже есть в проекте. Откройте его или удалите, чтобы подключить заново.

**«Срок авторизации истёк.» на карточке коннектора.** Яндекс перестал принимать ваш ключ —
например, ключ удалили в Yandex Cloud. Выпустите новый ключ, удалите коннектор и подключите его
заново с новым ключом.

**Агент сообщает, что лимит Вордстата на ключе Палитры исчерпан.** В сообщении указано, сколько
единиц использовано и когда лимит обновится. Дождитесь обновления, смените тариф или подключите
коннектор заново на своём ключе.

**Агент сообщает, что Вордстат временно недоступен на ключе Палитры.** Попробуйте позже или
подключите коннектор на своём ключе.

## Связанные статьи

- [Обзор коннекторов](/connectors/overview/)
- [Оплата](/organization/billing/)
