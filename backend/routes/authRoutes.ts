import express, {Request, Response} from 'express';
import UserModel from '../models/User';
import { signToken } from '../utils/jwt';
import { validateEmail, validateUsername } from '../utils/validation';
import { validatePassword } from '../utils/password';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

const router = express.Router();
router.post("/register", async (Request,Response) =>{
    try{
        const {username, email, password} = Request.body;
        
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return Response.status(400).json(createErrorResponse(emailValidation.message!));
        }
        
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return Response.status(400).json(createErrorResponse(usernameValidation.message!));
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return Response.status(400).json(createErrorResponse(passwordValidation.message!));
        }
        
        const existing = await UserModel.findOne({email});
        if (existing){
            return Response.status(400).json(createErrorResponse('User already exists'));
        }
        const user = new UserModel({username, email, password});
        await user.save();
        const token = signToken(String(user._id));
        Response.json(createSuccessResponse({token, user:{id:user._id, username, email}}, 'Registration successful'))
    } catch(error){
        Response.status(500).json(createErrorResponse('Registration failed'));
    }
});

router.post("/login", async (Request, Response) => {
    try {
        const { email, password } = Request.body;

        // Validate input
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return Response.status(400).json(createErrorResponse(emailValidation.message!));
        }
        
        if (!password) {
            return Response.status(400).json(createErrorResponse('Password is required'));
        }
        
        const user = await UserModel.findOne({email});
        if (!user){
            return Response.status(400).json(createErrorResponse('Invalid credentials'));
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
        return Response.status(400).json(createErrorResponse('Invalid credentials'));
        }
        const token = signToken(String(user._id));
        Response.json(createSuccessResponse({
            token,
            user:{id:user._id, username: user.username, email:user.email}
        }, 'Login successful'))
    } catch (error){
        Response.status(500).json(createErrorResponse("Login Failed"));
    }
});

export default router;