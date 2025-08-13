import { useState } from "react";
import type { Todo } from "../types/todo";

interface TodoProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleSave = () => {
    const trimmedText = editedText.trim();
    if (trimmedText.length > 0) {
      onEdit(todo._id, trimmedText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(todo.text); 
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center p-2 border-b border-pink-200 bg-rose-50">
      {isEditing ? (
        <>
          <input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
            className="border border-pink-300 px-2 py-1 col-span-1 rounded focus:border-pink-400"
          />
          <button
            onClick={handleSave}
            className="px-4 py-1 text-sm bg-pink-500 text-white rounded w-20 border border-pink-600 font-bold hover:bg-pink-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-1 text-sm bg-purple-500 text-white rounded w-20 border border-purple-600 font-bold hover:bg-purple-600"
          >
            Cancel
          </button>
          <div className="w-20"></div> {/* Empty cell for alignment */}
        </>
      ) : (
        <>
          <span
            className={`col-span-1 ${
              todo.completed ? "line-through text-gray-500" : "text-gray-800 font-bold"
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onToggle(todo._id)}
            className="px-4 py-1 text-sm bg-green-500 text-white rounded w-20 border border-green-600 font-bold hover:bg-green-600"
          >
            {todo.completed ? "Undo" : "Done"}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1 text-sm bg-yellow-500 text-white rounded w-20 border border-yellow-600 font-bold hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="px-4 py-1 text-sm bg-red-500 text-white rounded w-20 border border-red-600 font-bold hover:bg-red-600"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default TodoItem;