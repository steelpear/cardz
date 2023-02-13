import connectDB from '../../middleware/mongodb'
import Card from '../../models/Card'

const handler = async (req, res) => {
  await Card.findByIdAndRemove(req.body.id)
  res.send({ state: 'Deleted' })
}

export default connectDB(handler)
