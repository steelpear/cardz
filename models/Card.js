import mongoose from 'mongoose'

const { Schema } = mongoose
const Card = new Schema({
  name: String,
  hotel_id: String,
  description: String,
  sections: Array,
  city: String,
  active: Boolean,
  modified: Date,
  created: Date
}, { collection: 'collections_collection5efbe691ddae570c0cd31249' })

module.exports = mongoose.models.Card || mongoose.model('Card', Card)
