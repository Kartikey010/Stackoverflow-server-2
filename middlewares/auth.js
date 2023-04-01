import jwt from 'jsonwebtoken'

const auth =(req, res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1]//api se jo bearer wali string aayi hai usmein se token choose kia["Bearer","................"]
        let decodeData = jwt.verify(token, process.env.JWT_SECRET)//controllers auth mein signup function mein jwt.sign mein secrete key use ki "test" wahi hai
        req.userId = decodeData?.id
        next()
    } catch (error) {
        console.log("middfail")
        console.log(error)
    }
}

export default auth;