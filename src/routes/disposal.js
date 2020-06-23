import express from 'express'
import { api, addService, addUUID, addType, addMarks } from '../middleware/disposal'
const router = express.Router()

router.get('/', (req, res) => res.status(200).send({ status: 'Ok' }))
router.post('/status', addService('status'), api)
router.post('/settings', addService('setting'), api)
router.post('/info', addService('info'), api)
router.post('/request/send', addService('send'), addUUID, addType, addMarks, api)
router.post('/request/get', addService('get'), api)

module.exports = router
