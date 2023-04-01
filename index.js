import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import userRoutes from "./routes/users.js"
import questionRoutes from "./routes/Questions.js"
import answerRoutes from "./routes/Answers.js"
import pricingRoute from "./routes/Subscription.js"
import dotenv from "dotenv"

import nodemailer from "nodemailer"
//////
import bodyParser from "body-parser"
import  {Configuration, OpenAIApi} from "openai"
import Subscription from "./models/subscription.js";
//
import cron from "node-cron"

import Razorpay from "razorpay";
dotenv.config();
const config = new Configuration({
    apiKey:process.env.OPEN_AI_API_KEY
})

const openai = new OpenAIApi(config);

//////

const app =express();
/////
app.use(bodyParser.json());
app.use(cors());
app.post("/chat", async (req,res)=>{
    const {prompt} = req.body;
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `you are stackbot working for stackoverlow-clone.Answer only programming or technology related queries ${prompt}`,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      res.send(completion.data.choices[0].text);

})
//////


app.use(express.json({limit: '30mb',extend:true}));
app.use(express.urlencoded({limit: "30mb" ,extended: true}))
//app.use(cors());

app.get("/",(req,res)=>{
    res.send("this is a stack overflow api")
})

app.use("/user", userRoutes)
app.use("/questions",questionRoutes)
app.use("/answer", answerRoutes)
app.use("/",pricingRoute)

const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.CONNECTION_URL
mongoose.set("strictQuery",false);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/createOrder", async (req, res) => {
  const { amount } = req.body;
  console.log(req.body)
  const options = {
    amount: amount,
    currency: "INR",
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


mongoose.connect(DATABASE_URL,{useNewUrlParser: true, useUnifiedTopology:"true"})
    .then(()=>app.listen(PORT,()=>{
        console.log(`server is running on ${PORT}`)
    }))
    .catch((err)=>{
        console.log(err)
    })


const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, expires: '10m', default: Date.now },
});

// Define the model for the OTP collection
const Otp = mongoose.model('Otp', otpSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
   
  auth: {
    user: process.env.EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());


// Routes
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save the OTP to the database
  const newOtp = new Otp({ email, otp });
  
  newOtp.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Send the OTP to the user's email
    const mailOptions = {
      from: "testyasemail1@gmail.com",
      to: email,
      subject: 'OTP Verification',
      html: `Your stackoverflow-clone OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error in sending' });
      }

      res.status(200).json({ message: 'OTP sent successfully' });
    });
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if the OTP is valid
  Otp.findOne({ email, otp }, (err, otpDoc) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  });
});
////////

// const subscriptionSchema = new mongoose.Schema({
//   user: {
//     type: String,
//     required: true
//   },
//   plan: {
//     type: String,
//     required: true
//   },
//    count:{
//     type:Number,
//     default:1
//    },

//    expireAt: {
//     type: Date,
//     default: Date.now,
//     index: { expires: '1m' }, // expire after 1 month
//   }
// });

// const Subscription = mongoose.model('Subscription', subscriptionSchema);

//cron job for daily update
cron.schedule('0 0 * * *', async () => {
  try {
    const result1 = await Subscription.updateMany({ plan: /silver/i }, { count: 10 });
    console.log(`silver plan documents updated with count 10`);

    const result2 = await Subscription.updateMany({ plan: /free plan/i }, { count: 1 });
    console.log(`free plan documents updated with count 1`);
  } catch (error) {
    console.error(error);
  }
});


///
// app.post("/Pricing",async (req,res)=>{
//      const data = req.body;
//      console.log(data);
//      //res.send("hi from pricing page")
//      const newSubscription= new Subscription(data);
//      try{
//          await newSubscription.save(); /*saving in mongodb*/
//          res.status(200).json("saved a subscription successfully")
     
     
//         }catch(error){
//              console.log(error)
//              res.status(409).json("Couldn't save a new subscription")
//         }
// })





// app.post("/Pricing",async(req,res)=>{
//    const data =req.body;
//    const email=req.body.user;
//    console.log(data);
//    Subscription.updateOne({ user: email }, { $set: data }, { upsert: true }, function(err, result) {
//     if (err) {
//       console.log(err);
//       res.status(500).send('Error updating document');
//     } else {
//       console.log("Document updated successfully.");
//       res.status(200).send('Document updated successfully.');
//     }
//   })
// })



// app.post("/update",async (req,res)=>{
//     const email= req.body.email;
//     try{
//     await Subscription.updateOne(
//       { user: email },
//       { $inc: { count: -1 } }
//     )
//     res.status(200).send("you have posted one question")
//     }
//     catch(error){
//       console.log(error);
//       res.send("some error while updating count(posting question)")
//     }
// })

// app.post("/getCount",async(req,res)=>{
//      const UserEmail= req.body.email;
//       console.log(req.body)
//       console.log(UserEmail+"--email");
// try {
//   const subscription = await Subscription.findOne({ user: UserEmail }, { count: 1 }).exec();
//   console.log(subscription);
//   const count=subscription.count==Infinity?1000000:subscription.count;
//   res.status(200).send({count});
// } catch (error) {
//   console.log(error);
//   res.status(500).send({ message: "Internal server error" });
// }
// })


// app.post("/check/silver",(req,res)=>{
//    const email= req.body.sendUser;
//    console.log(email)
//    Subscription.findOne({user:email, $or: [{plan: 'Silver'},{ plan: 'Gold'}]}, function(err, response){
//     if(err){
//       console.log(err);
//     } else if(response){
      
//     res.send(true)
//     }else {
//        //res.send(response);
//        res.send(false)
//      }
//   })
// })

// app.post("/check/free",(req,res)=>{
//   const email= req.body.sendUser;
//   console.log(email)
//   Subscription.findOne({user:email, $or: [{plan: 'Silver'},{ plan: 'Free plan'},{plan:"Gold"}]}, function(err, response){
//    if(err){
//      console.log(err);
//    } else if(response){
     
//    res.send(true)
//    }else {
//       //res.send(response);
//       res.send(false)
//     }
//  })
// })

// app.post("/check/gold",(req,res)=>{
//      const email= req.body.sendUser;
//      console.log(email)
//      Subscription.findOne({user:email,plan:"Gold"},function (err,response){
//       if(err){
//         console.log(err);
//       } else if(response){
        
//       res.send(true)
//       }else {
//          //res.send(response);
//          res.send(false)
//        }
//      })
// })

