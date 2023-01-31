import connectDB from '../../middleware/mongodb'
import Card from '../../models/Card'

const handler = async (req, res) => {
  res.send(await Card.find({ active: true }, 'name city hotel_id'))
}

export default connectDB(handler)
