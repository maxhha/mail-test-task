# Тестовое для VK (old Mail)

Сервис [Записная книга](https://mail-test-task.herokuapp.com) со следующим функционалом:

1. пользователь при переходе по ссылке с секретным ключом становится авторизованным. Затем он может совершать следующие пункты.
2. добавить новую запись из полей - Текстовое описание, Дата дедлайна, опциональная картинка. Записи сортируются от новых к старым.
3. отметить запись как сделанную. И обратное действие - вернуть запись из сделанного в актуальное.
4. получить кнопочкой новую ссылку для новой «записной книги».

Использованный стек:

- [Django](https://www.djangoproject.com/)
- [Django Rest Frameworkn](https://www.django-rest-framework.org/)
- [nginx](https://nginx.org/) - отдает статику и перенаправляет запросы в django
