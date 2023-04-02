import Subscription from "../models/subscription.js"
import mongoose from "mongoose"
//import cron from "node-cron"

// export const Subscribe= async(req,res)=>{
//         const {data}=req.body;
//         console.log(data);
//         console.log("hi")
//         res.send("subscribe sunction")
//        /* const newSubscription= new subscriptions(data);
//         try{
//             await newSubscription.save(); *//*saving in mongodb*/
//           /*  res.status(200).json("saved a subscription successfully")
        
        
//            }catch(error){
//                 console.log(error)
//                 res.status(409).json("Couldn't save a new subscription")
//            }*/

// }
// cron.schedule('0 0 * * *', async () => {
//     try {
//       const result1 = await Subscription.updateMany({ plan: /silver/i }, { count: 10 });
//       console.log(`silver plan documents updated with count 10`);
  
//       const result2 = await Subscription.updateMany({ plan: /free plan/i }, { count: 1 });
//       console.log(`free plan documents updated with count 1`);
//     } catch (error) {
//       console.error(error);
//     }
//   });

  export const Subscribe =async(req,res)=>{
    const data =req.body;
    const email=req.body.user;
    console.log(data);
    Subscription.updateOne({ user: email }, { $set: data }, { upsert: true }, function(err, result) {
     if (err) {
       console.log(err);
       res.status(500).send('Error updating document');
     } else {
       console.log("Document updated successfully.");
       res.status(200).send('Document updated successfully.');
     }
   })
}
    
  export const updateCount = async (req,res)=>{
    const email= req.body.email;
    try{
    await Subscription.updateOne(
      { user: email },
      { $inc: { count: -1 } }
    )
    res.status(200).send("you have posted one question")
    }
    catch(error){
      console.log(error);
      res.send("some error while updating count(posting question)")
    }
   }

   export const getCount =async(req,res)=>{
  
    const UserEmail= req.body.email;
     console.log(req.body)
     console.log(UserEmail+"--email");
try {
 const subscription = await Subscription.findOne({ user: UserEmail }, { count: 1 }).exec();
 console.log(subscription);
 const count=subscription.count==Infinity?1000000:subscription.count;
 res.status(200).send({count});
} catch (error) {
 console.log(error);
 res.send({count:0});
}

    
}

  export const check_silver =async(req,res)=>{
    const email= req.body.sendUser;
    console.log(email)
    Subscription.findOne({user:email, $or: [{plan: 'Silver'},{ plan: 'Gold'}]}, function(err, response){
     if(err){
       console.log(err);
     } else if(response){
       
     res.send(true)
     }else {
        //res.send(response);
        res.send(false)
      }
   })
  }

  export const check_free = async(req,res)=>{
    const email= req.body.sendUser;
    console.log(email)
    Subscription.findOne({user:email, $or: [{plan: 'Silver'},{ plan: 'Free plan'},{plan:"Gold"}]}, function(err, response){
     if(err){
       console.log(err);
     } else if(response){
       
     res.send(true)
     }else {
        //res.send(response);
        res.send(false)
      }
   })
  }

  export const check_gold = async(req,res)=>{
    const email= req.body.sendUser;
    console.log(email)
    Subscription.findOne({user:email,plan:"Gold"},function (err,response){
     if(err){
       console.log(err);
     } else if(response){
       
     res.send(true)
     }else {
        //res.send(response);
        res.send(false)
      }
    })
}
 