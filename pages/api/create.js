import connectDB from '../../middleware/mongodb'
import Card from '../../models/Card'

const handler = async (req, res) => {
  const card = new Card(req.body)
  await card.save()
  res.send(card.hotel_id)
}

export default connectDB(handler)
