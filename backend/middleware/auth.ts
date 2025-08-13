import { verifyToken } from '../utils/jwt';

const authenticate = async (req:any, res:any, next:any) =>{
  const token = req.header("Authorization")?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try{
    const decoded = verifyToken(token) as any;
    req.userId = decoded.id;
    next();
  } catch (error){
    res.status(401).json({error: "Invalid token"});
  }
}

export default authenticate;