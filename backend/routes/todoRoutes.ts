import express from 'express';
import Todo from "../models/Todo"
import authenticate from "../middleware/auth"
const router= express.Router();

router.use(authenticate);

router.get("/", async (req: any, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId });
        res.json(todos);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});


router.post("/", async(req: any, res)=>{
    try{
        const{text}= req.body;
        const newTodo= new Todo ({text, completed:false, userId: req.userId});
        await newTodo.save();
        res.json(newTodo);
    } catch(e){
        res.status(400).json({ error: "Failed to create todo" });
    }
})

router.patch("/:id", async (req: any, res) => {
  try {
    const { completed, text } = req.body;
    const updateData: any = {};
    
    if (completed !== undefined) updateData.completed = completed;
    if (text !== undefined) updateData.text = text.trim();
    
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    res.json(updatedTodo);
  } catch (e) {
    res.status(400).json({ error: "Failed to update todo" });
  }
});

router.put("/:id", async (req: any, res)=>{
    try{
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            {new: true}
        );
        if (!updatedTodo) {
          return res.status(404).json({ error: "Todo not found" });
        }
        res.json(updatedTodo);
    } catch( e){
        res.status(400).json({ error: "Failed to update todo" });
    }
})

router.delete("/:id", async (req: any, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete todo" });
  }
});

export default router;