import connectDB from '../../middleware/mongodb'
import Card from '../../models/Card'

const handler = async (req, res) => {
  const { id, data } = req.body
  const response = await Card.findByIdAndUpdate(id, data)
  if (response) {res.send({state: 'true'})} else {res.send({state: 'false'})}
}

export default connectDB(handler)
