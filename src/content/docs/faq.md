---
title: Частые вопросы
description: Короткие ответы на частые вопросы о настройке и работе в Палитре.
editions: [saas, byoc]
sources:
  - palitra-frontend/components/onboarding/onboarding-wizard.tsx
  - palitra-frontend/components/onboarding/onboarding-wizard.ru.messages.json
  - palitra-frontend/components/onboarding/steps/step-attribution.ru.messages.json
  - palitra-frontend/components/chat/chat-composer.ru.messages.json
  - palitra-frontend/components/org-settings/org-invite-dialog.ru.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.tsx
  - palitra-frontend/components/connectors/connected-connector-card.ru.messages.json
  - palitra-frontend/components/layout/AppSidebar.tsx
  - palitra-frontend/components/layout/app-sidebar.ru.messages.json
  - palitra-frontend/app/[locale]/(app)/projects/[projectId]/settings/project-settings.ru.messages.json
  - palitra-backend/src/connectors/yandex/yandex_direct/manifest.yaml
  - palitra-frontend/app/[locale]/(app)/chat/page.tsx
  - palitra-frontend/app/[locale]/(app)/chat/[chatId]/page.tsx
---

## Можно ли пропустить шаги мастера настройки?

Да, необязательные. На них есть кнопка «Пропустить» — всё пропущенное можно настроить позже.
На шагах с организацией, оплатой и проектом этой кнопки нет. С шага оплаты можно выйти
кнопкой «Настрою позже»: мастер откроет страницу биллинга.

## Почему в мастере нет шага «Настройки атрибуции»?

Этот шаг появляется, только если вы подключили аналитику, например Яндекс Метрику. Вернитесь
на шаг «Подключите платформы» и подключите её.

## Будет ли агент менять кампании без моего ведома?

По умолчанию нет. Изменения в Яндекс Директе требуют вашего подтверждения, а удаление выключено в
ограничениях коннектора. Если вы можете одобрять действия, в меню «Режим подтверждения» в поле ввода
чата можно выбрать «Авто». Тогда агент сам выполняет изменения, которые соответствуют вашим
просьбам, но про удаления всё равно спрашивает. Подробнее — в статье [Менеджеру
проекта](/getting-started/manager/).

## Как пригласить человека, который уже работает в другой организации?

Один человек может состоять только в одной организации. Пригласите его в нужный проект с ролью
«Гость».

## Что будет с данными, если удалить коннектор?

Синхронизации и вызовы инструментов остановятся сразу, а уже загруженные данные сохранятся и
останутся доступны. Чтобы подключить аккаунт снова, добавьте его на вкладке «Маркетплейс».

## Где изменить инструкции для агента?

Откройте «Настройки проекта» → «Инструкции и контекст».

## Почему я не вижу «Настройки организации»?

Этот пункт есть только у владельца и администратора организации. Если вам нужен доступ,
обратитесь к ним.
