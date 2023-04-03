// export default function handler (req, res) {
//     res.status(200).end('Hello Cron!');
//   }

 const handler = async(req,res)=>{
    try {
        const result1 = await Subscription.updateMany({ plan: /silver/i }, { count: 10 });
        console.log(`silver plan documents updated with count 10`);
    
        const result2 = await Subscription.updateMany({ plan: /free plan/i }, { count: 1 });
        console.log(`free plan documents updated with count 1`);
      } catch (error) {
        console.error(error);
      }
 }

  export default handler;
//   cron.schedule('0 0 * * *', async () => {
//     try {
//       const result1 = await Subscription.updateMany({ plan: /silver/i }, { count: 10 });
//       console.log(`silver plan documents updated with count 10`);
  
//       const result2 = await Subscription.updateMany({ plan: /free plan/i }, { count: 1 });
//       console.log(`free plan documents updated with count 1`);
//     } catch (error) {
//       console.error(error);
//     }
//   });