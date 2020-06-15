import express from 'express'
import { api, addService, addUUID, addType, addMarks } from '../middleware/disposal'
const router = express.Router()

router.get('/', (req, res) => res.status(200).send({ status: 'Ok' }))
router.get('/status', addService('status'), api)
router.get('/settings', addService('setting'), api)
router.get('/info', addService('info'), api)
router.post('/request', addService('send'), addUUID, addType, addMarks, api)
router.get('/request', addService('get'), api)

module.exports = router
