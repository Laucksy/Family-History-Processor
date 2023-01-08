import express from 'express'
import { People } from './models/index.js'

const index = express.Router()

index.route('/')
  .get((req, res) => {
    res.status(200).json({description: 'This is the API for the Family History Processor.'})
  })

index.route('/people')
  .get(async (req, res) => {
    const people = await People.retrieve()

    res.status(200).send({ people })
  })
  .post(async (req, res) => {
    const data = req.body
    const query = data._id ? { _id: data._id } : { name: data.name }

    let promise = data._id ? People.findOneAndUpdate({_id: data._id}, { $set: data }) : People.create(data)

    return promise
      .then((obj) => People.retrieve(obj._id, 1))
      .then((item) => res.status(200).send(item[0]))
  })

export default { index }
