// набор middleware для формировани язапроса к регистратору выбытия

import createError from 'http-errors'
import { v4 } from 'uuid'
import apiCall from '../models/disposal'
import { DISPOSAL_SERVICES } from '../services'
const TYPES = ['checkMarks', 'registerMarksByRequisites']

// Добавляем имя сервиса в параметры
//
const addService = name => (req, res, next) => {
  req.body.name = name
  next()
}

// Добавляем UUID в параметры
//
const addUUID = (req, res, next) => {
  req.body.rvRequestId = v4()
  next()
}

// Добавляем тип запроса в параметр request ( может быть - проверка маркировок или выбытие маркировок )
// В зависимости от типа операции вызывает дальнейшие middleware
//
const addType = (req, res, next) => {
  if (!req.body.type || !TYPES.includes(req.body.type)) throw new Error('Тип операции не задан или задан неверно')
  req.body.request = {
    type: req.body.type
  }
  if (req.body.type === 'checkMarks') addCheck(req, res, next)
  if (req.body.type === 'registerMarksByRequisites') addDocument(req, res, next)
}

// Добавляет признак окальной проверки в параметр request
//
const addCheck = (req, res, next) => {
  req.body.request = {
    ...req.body.request,
    localCheck: true
  }
  next()
}

// Добавляет реквизиты выбытия в параметры запроса,  в случае отсутствия отдельных параметров
// подставляет значения по умолчанию
//
const addDocument = (req, res, next) => {
  if (!req.body.dateDocument) throw new Error('Не задана дата документа-основания')
  if (!req.body.numberDocument) throw new Error('Не задан номер документа основания')
  req.body.request.documentOut = {
    type: req.body.typeDocument || 0,
    code: req.body.typeDocument ? '3108805' : '0504204',
    codeName: req.body.typeDocument ? 'Рецепт по форме 148-1/у-04(л)' : 'Требование-накладная',
    date: req.body.dateDocument,
    series: req.body.seriesDocument || '',
    number: req.body.numberDocument
  }
  next()
}

// Добавляет в параметр request список марок ЛС для проверки или выбытия
//
const addMarks = (req, res, next) => {
  if (!req.body.marks || typeof req.body.marks !== 'object') throw new Error('Не задан массив отсканированних маркировок (КИЗ)')
  if (!req.body.request || typeof req.body.request !== 'object') throw new Error('Отстуствует объект запроса')
  req.body.request.marks = req.body.marks.reduce((acc, el, i) => {
    acc = { ...acc, [i + 1]: { mark: getMark(el), ...getSoldPart(el) } }
    return acc
  }, {})
  next()
}

//  Возвращает марку из строки или объекта
//
const getMark = el => typeof el === 'object' && el.mark ? el.mark : el

// Возвращет часть упаковки ЛС при выбытия в случае наличия. При отстутсвии - пустой объект
//
const getSoldPart = el => typeof el === 'object' && el.soldPart ? { soldPart: el.soldPart } : {}

// Находит сервис по имени в списке сервисов
//
const getApi = name => DISPOSAL_SERVICES.find(el => el.name === name) || { message: '' }

//  Возвращает сообщение об ошибке для указанного по имени сервиса
//
const getMessage = ({ name }) => getApi(name).message

// Дергает вызов api, возвращает данные или сообщение об ошибке
//
const api = async (req, res, next) => {
  try {
    console.log(req.body)
    const { data } = await apiCall(req.body)
    console.log(data)
    res.status(200).send(data ? { ...data } : { rvRequestId: req.body.rvRequestId })
  } catch (err) {
    console.error(err)
    next(createError(503, err.message || getMessage(req.body) || 'Произошла внутрення ошибка сервиса'))
  }
}

module.exports = { api, addService, addMarks, addUUID, addType }
