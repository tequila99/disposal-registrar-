import express from 'express'
import disposal from './disposal'

const router = express.Router()

router.use('/disposal', disposal)

module.exports = router
