import connectDB from '../../middleware/mongodb'
import Card from '../../models/Card'

const handler = async (req, res) => {
  const data = await Card.findOne({hotel_id:req.body.id})
  if (data) { res.send(data) } else { res.send({ state: 'false' }) }
}

export default connectDB(handler)
