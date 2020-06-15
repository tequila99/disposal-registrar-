import axios from 'axios'
import https from 'https'
import { DISPOSAL_SERVICES } from '../services'

// Отключаем проверку сертификата в регистраторе
//
const agent = new https.Agent({
  rejectUnauthorized: false
})

// Получаем имя пользователя РВ
const getUserRV = username => username || process.env.USER_RV || 'user1'

// Получаем пароль пользователя РВ
const getPasswordRV = password => password || process.env.PASSWORD_RV || 'Pas$w0rd'

// Получаем токен авторизации из имени и пароля пользователя
const getToken = (username, password) => Buffer.from(`${getUserRV(username)}:${getPasswordRV(password)}`, 'utf8').toString('base64')

// Получаем данные серивса из списка сервисов по имени
const getCall = name => DISPOSAL_SERVICES.find(el => el.name === name) || { url: '', method: 'get' }

// Формируем url запроса по имени сервиса
const getUrl = ({ name, rvRequestId = '' }) => name !== 'get' ? getCall(name).url : `${getCall(name).url + '/' + rvRequestId}`

// Получаем метод вызова API по имени
const getMethod = name => getCall(name).method

// Возвращаем UUID запроса или пустой объект при отсутсвии UUID
const getUUID = rvRequestId => rvRequestId ? { rvRequestId } : {}

// Возвращаем объект request при его наличии или пустой объект
const getRequest = request => Object.keys(request) !== 0 ? { request } : {}

// Возвращаетм данные для запроса
const getData = ({ request = {}, rvRequestId = '' }) => ({
  ...getUUID(rvRequestId),
  ...getRequest(request)
})

// Вызываем API на стороне регистратора выбытия
const callApi = async ({ ip, port, username = '', password = '', name = '', ...args }) => {
  if (!ip) throw new Error('Не задан адрес регистратора выбытия в локальной сети')
  if (!port) throw new Error('Не задан порт регистратора выбытия')
  if (!name) throw new Error('Не задан путь вызова метода')
  return await axios({
    method: getMethod(name),
    baseURL: `https://${ip}:${port}/v1/`,
    url: getUrl({ name, ...args }),
    headers: {
      Authorization: `Basic ${getToken(username, password)}`
    },
    httpsAgent: agent,
    data: getData(args)
  })
}

module.exports = callApi
