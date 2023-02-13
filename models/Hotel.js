import mongoose from 'mongoose'

const { Schema } = mongoose
const Hotel = new Schema({
  name: String
}, { collection: 'collections_collection5a5dc18e670fd819bca20da7' })

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', Hotel)
