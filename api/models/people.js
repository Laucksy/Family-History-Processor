import mongoose from 'mongoose'
const { Types } = mongoose.Schema

const schema = new mongoose.Schema({
  _id: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  birth: {
    date: { type: String, default: '' },
    location: { type: String, default: '' }
  },
  death: {
    date: { type: String, default: '' },
    location: { type: String, default: '' },
    burial: { type: String, default: '' }
  },
  spouse: [{ type: Types.ObjectId, ref: 'People' }],
  exes: [{ type: Types.ObjectId, ref: 'People' }],
  parents: [{ type: Types.ObjectId, ref: 'People' }],
  created_at: Date,
  updated_at: Date
})

schema.statics.retrieve = function(query, limit = 100) {
  return this.find(query)
    .populate('spouse', 'name')
    .populate('exes', 'name')
    .populate('parents', 'name')
    .limit(limit)
    .lean()
    .exec()
}

const handleUpdate = function(next) {
  // Handles updated_at
  const currentDate = Date.now()
  if (this.getUpdate().$set) this.getUpdate().$set.updated_at = currentDate
  else this.getUpdate().$set = { updated_at: currentDate }
  this.getUpdate().$setOnInsert = { created_at: currentDate }
  next()
}

schema.pre('save', function(next) {
  // Handles created_at and updated_at
  const currentDate = Date.now()
  this.updated_at = currentDate
  if (!this.created_at) this.created_at = currentDate
  next()
})
schema.pre('update', handleUpdate)
schema.pre('findOneAndUpdate', handleUpdate)

const People = mongoose.model('People', schema)
export default People
