const mongoose = require('mongoose')

const RaceSchema = new mongoose.Schema({
  raceName: {
    type: String,
    required: true, 
  },
  startDate: {
    type: Number,
    required: true,
  },
  endDate: {
    type: Number,
    required: true,
  },
  segments:{
    type: Array,
    required: false,
  },
  organiserID: {
    type: String,
    required: true
  },
  partPass: {
    type: String,
    required: true
  },
  participants: {
    type: Array,
    required: true
  }
  

})

module.exports = mongoose.model('Race', RaceSchema)
