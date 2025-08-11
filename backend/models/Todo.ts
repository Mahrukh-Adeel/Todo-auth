import {model, Schema, Document} from 'mongoose';

interface Todo extends Document{
    text: string;
    completed: boolean;
    userId: Schema.Types.ObjectId;
}
const TodoSchema= new Schema<Todo>({
    text:{type:String, required:true},
    completed: {type:Boolean, required:true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true }
})

export default model<Todo>('Todo', TodoSchema);