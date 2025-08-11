import express from 'express';
import jwt  from 'jsonwebtoken';
import UserModel from '../models/User';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}
router.post("/register", async (req,res) =>{
    try{
        const {username, email, password} = req.body;
        const existing = await UserModel.findOne({email});
        if (existing){
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new UserModel({username, email, password});
        await user.save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({token, user:{id:user._id, username, email}})
    } catch(error){
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post("/login", async (req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});
        if (!user){
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
        return res.status(400).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({id:user._id}, JWT_SECRET)
        res.json({
            token,
            user:{id:user._id, username: user.username, email:user.email}
        })
    } catch (error){
        res.status(500).json({error: "Login Failed"});
    }
});

export default router;