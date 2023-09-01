import express from 'express'

import * as coreController from '../controllers/core.controller.js'

const router = express.Router()

router.get('/', coreController.getBaseRoute)

export { router }