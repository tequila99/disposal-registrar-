export const DISPOSAL_SERVICES = [
  {
    name: 'status',
    message: 'Произошла ошибка при попытке получить статус регистратора выбытия',
    url: 'state'
  },
  {
    name: 'setting',
    message: 'Произошла ошибюка при попытке получить настройки регистратора выбытия',
    url: 'settings'
  },
  {
    name: 'info',
    message: 'Произошла ошибюка при попытке получить информацию о регистраторе выбытия',
    url: 'deviceInfo'
  },
  {
    name: 'send',
    message: 'Произошла ошибка при попытке записать залание в очередь регистратора выбытия',
    url: 'requests',
    method: 'post'
  },
  {
    name: 'get',
    message: 'Произошла ошибка при попытке запросить результат выполнения запроса',
    url: 'requests'
  }
]
