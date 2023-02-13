import connectDB from '../../middleware/mongodb'
import City from '../../models/City'

const handler = async (req, res) => {
  res.send(await City.findById(req.body.id))
}

export default connectDB(handler)
