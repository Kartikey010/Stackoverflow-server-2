//const mongoose = require('mongoose');
import mongoose from "mongoose"

// const subscriptionSchema = new mongoose.Schema({
//   user: {
//     //type: mongoose.Schema.Types.ObjectId,
//     //ref: 'User',
//     type: String,
//     required: true
//   },
//   startDate: {
//     type: Date,
//     required: true
//   },
//   endDate: {
//     type: Date,
//     required: true
//   },
//   plan: {
//     type: String,
//     required: true
//   },
// });

// const Subscription = mongoose.model('Subscription', subscriptionSchema);

// //module.exports = Subscription;

const subscriptionSchema = new mongoose.Schema({
    user: {
      type: String,
      required: true
    },
    plan: {
      type: String,
      required: true
    },
     count:{
      type:Number,
      default:1
     },
     time_to_end: { type: Date, default: Date.now }
      
  });
  
  subscriptionSchema.index({ time_to_end: 1 }, { expireAfterSeconds: 2628288 });
  const Subscription = mongoose.model('Subscription', subscriptionSchema);
  export default Subscription;
