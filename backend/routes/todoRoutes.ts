import express, { Request, Response } from 'express';
import Todo from "../models/Todo"
import authenticate from "../middleware/auth"
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../types/express';
const router= express.Router();

router.use(authenticate);

router.get("/", async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
        const todos = await Todo.find({ userId: authReq.userId });
        res.json(createSuccessResponse(todos));
    } catch (e) {
        res.status(500).json(createErrorResponse("Failed to fetch todos"));
    }
});


router.post("/", async(req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json(createErrorResponse("Todo text is required"));
        }
        const newTodo = new Todo({ text: text.trim(), completed: false, userId: authReq.userId });
        await newTodo.save();
        res.json(createSuccessResponse(newTodo, "Todo created successfully"));
    } catch (e) {
        res.status(400).json(createErrorResponse("Failed to create todo"));
    }
})

router.patch("/:id", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { completed, text } = req.body;
    const updateData: any = {};
    
    if (completed !== undefined) updateData.completed = completed;
    if (text !== undefined) updateData.text = text.trim();
    
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: authReq.userId },
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

router.put("/:id", async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: authReq.userId },
            req.body,
            { new: true }
        );
        if (!updatedTodo) {
          return res.status(404).json({ error: "Todo not found" });
        }
        res.json(updatedTodo);
    } catch (e) {
        res.status(400).json({ error: "Failed to update todo" });
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: authReq.userId });
    if (!deletedTodo) {
      return res.status(404).json(createErrorResponse("Todo not found"));
    }
    res.json(createSuccessResponse(null, "Todo deleted successfully"));
  } catch (err) {
    res.status(400).json(createErrorResponse("Failed to delete todo"));
  }
});

export default router;