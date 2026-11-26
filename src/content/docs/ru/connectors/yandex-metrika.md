---
title: Яндекс Метрика
description: Как подключить Яндекс Метрику, какие данные загружает Палитра и что умеет агент.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/yandex/vendor_manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_metrika/manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_metrika/extractor.py
  - palitra-backend/src/connectors/yandex/yandex_metrika/error_mapping.py
  - palitra-frontend/components/onboarding/onboarding-wizard.tsx
  - palitra-frontend/components/onboarding/connect-dialog.tsx
  - palitra-frontend/components/onboarding/connect-dialog.ru.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.ru.messages.json
  - palitra-frontend/components/onboarding/steps/step-attribution.ru.messages.json
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/components/connector-setup/wizard.tsx
  - palitra-frontend/components/connector-setup/wizard.ru.messages.json
  - palitra-frontend/components/connector-setup/oauth-popup.ru.messages.json
  - palitra-frontend/components/connector-setup/oauth-error-client.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.tsx
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.tsx
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.ru.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.ru.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.ru.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.ru.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.ru.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.ru.messages.json
  - palitra-frontend/lib/connectors/tool-title.ts
  - palitra-frontend/components/connectors/credentials-list.ru.messages.json
---

Коннектор Яндекс Метрики загружает в Палитру данные о визитах на сайт и достижения целей. Цели
попадают в события проекта. Один коннектор работает с одним счётчиком Метрики.

## Подключение в мастере настройки

Если вы проходите мастер настройки после регистрации:

1. На шаге «Подключите платформы» найдите карточку «Яндекс Метрика» и нажмите «Подключить».
2. В окне «Подключить Яндекс Метрика» нажмите «Авторизоваться».
3. Войдите в Яндекс во всплывающем окне и разрешите доступ.
4. Палитра покажет счётчики, доступные вашему аккаунту. Выберите счётчик и нажмите
   «Подключить».

Коннектор подключится с настройками по умолчанию. После подключения Метрики в мастере
появится шаг «Настройки атрибуции».

## Подключение из раздела «Коннекторы»

1. В боковой панели откройте «Коннекторы» и перейдите на вкладку «Маркетплейс».
2. На карточке «Яндекс Метрика» нажмите «Подключить». Откроется страница «Подключение Яндекс
   Метрика».
3. **«Авторизация».** Нажмите «Подключить через OAuth» и войдите в Яндекс во всплывающем окне.
   Отметьте «Сохранить на уровне организации», если тот же доступ понадобится в других
   проектах.
4. **«Выбор аккаунта».** В списке «Выберите субаккаунт» выберите счётчик.
5. **«Разрешения».** Для каждого инструмента агента выберите: «Всегда разрешать», «Требует
   подтверждения» или «Заблокировано».
6. **«Проверка».** Проверьте настройки и нажмите «Готово». Палитра подключит коннектор и
   проверит доступ.
7. **«Сопоставление событий».** Этот шаг идёт после подключения. Сопоставьте события Метрики с
   событиями проекта и нажмите «Сохранить сопоставление» или «Пропустить».

Пока ни одно событие не сопоставлено, все события загружаются под своими именами. Если вы
сопоставили хотя бы одно, события без сопоставления не загружаются.

Счётчик после подключения не меняется. Чтобы работать с другим счётчиком, подключите Метрику
ещё раз и выберите его.

## Какие данные загружаются

Палитра загружает из Метрики:

- визиты на сайт;
- достижения целей счётчика — они становятся событиями проекта;
- события электронной коммерции: просмотры товаров и списков, добавление в корзину и удаление
  из неё, покупки и возвраты.

## Что умеет агент

Агент читает данные Метрики через инструменты. Все они только читают данные и по умолчанию
разрешены всегда:

- «Произвольный отчёт» — отчёт с нужными группировками, метриками и фильтрами;
- «Список целей» — цели, настроенные в счётчике;
- «Список сегментов» — сохранённые сегменты счётчика;
- «Сравнение периодов» — два периода рядом.

## Частые проблемы

Если с коннектором что-то не так, на его карточке в разделе «Коннекторы» появляется значок.
Наведите на него, чтобы увидеть, что случилось и что делать.

**«Срок авторизации истёк.»** В разделе «Коннекторы» откройте вкладку «Учётные данные», в строке
учётных данных Яндекса нажмите на три точки и выберите «Reconnect», затем войдите в Яндекс заново.
Подробнее — в [обзоре коннекторов](/connectors/overview/).

**«У коннектора нет доступа к этому аккаунту.»** У логина, под которым вы подключали
коннектор, больше нет доступа к счётчику. Попросите владельца счётчика выдать доступ и
переподключите коннектор.

**«Последняя синхронизация завершилась ошибкой.»** Палитра повторит попытку при следующей
синхронизации. Если ошибка повторяется, нажмите «Синхронизировать» на карточке коннектора или
напишите в поддержку.

**Всплывающее окно не открылось.** Браузер заблокировал его. Нажмите на ссылку под кнопкой,
чтобы открыть страницу авторизации в новой вкладке, или разрешите всплывающие окна для
Палитры.

**«Вы отклонили запрошенные разрешения.»** Повторите авторизацию и одобрите все запрашиваемые
права.

**«Этот аккаунт уже подключён в проекте.»** Этот счётчик уже подключён. Откройте подключённый
коннектор или удалите его и подключите заново.

**«Этот вход в Яндекс выдан без доступа к Метрике.»** Учётные данные Яндекса сохранены, когда
подключали другой коннектор Яндекса, например Директ, и доступ к Метрике тогда не запрашивался.
Нажмите «Разрешить доступ» и подтвердите доступ во всплывающем окне Яндекса: Палитра обновит те
же учётные данные, а другие коннекторы Яндекса продолжат работать.

**На шаге выбора счётчика нет ни одного счётчика.** У логина, под которым вы вошли, нет доступа
ни к одному счётчику. Попросите владельца счётчика выдать доступ или нажмите «Назад к
авторизации» и выберите другой логин.
