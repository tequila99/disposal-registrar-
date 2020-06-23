import express from 'express'
import disposal from './disposal'

const router = express.Router()

router.use('/disposal', (req,res,next) => { console.log(req.params); next() }, disposal)

module.exports = router
