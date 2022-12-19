import express from 'express'
// import path from 'path'
// import cfg from './config.js'
import { People } from './models/index.js'

const index = express.Router()

index.route('/')
  .get((req, res) => {
    res.status(200).json({
      // version: cfg.server.version,
      description: 'This is the API for the Family History Processor.'
    })
  })

// index.route('/home').get((req, res) => {
//   res.sendFile(path.join(path.resolve(), 'html/index.html'))
// })

index.route('/people')
  .get(async (req, res) => {
    const people = await People.retrieve()

    res.status(200).send({ people })
  })
  .post(async (req, res) => {
    const data = req.body
    const query = data._id ? { _id: data._id } : { name: data.name }

    People.findOneAndUpdate(query, { $set: data }, { upsert: true, new: true })
      .then(() => People.retrieve(query, 1))
      .then((item) => res.status(200).send(item[0]))
  })

export default { index }
