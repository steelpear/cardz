import connectDB from '../../middleware/mongodb'
import Hotel from '../../models/Hotel'

const handler = async (req, res) => {
  const {id} = req.body
  res.send(await Hotel.findById(id, 'name city'))
}

export default connectDB(handler)
