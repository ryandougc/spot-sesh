import express from 'express'

import { router as coreRoutes }from '../routes/core.routes.js'

export default class App {
    express

    constructor() {
        this.express = express()
        this.mountRoutes()
    }

    mountRoutes() {
        this.express.use('/', coreRoutes)
    }
}