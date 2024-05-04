import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import './App.css';

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addNewTask = () => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { task: newTodo, id: uuidv4(), isDone: false },
    ]);
    setNewTodo("");
  };

  const updateTodoValue = (event) => {
    setNewTodo(event.target.value);
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const upperCaseAll = () => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => ({ ...todo, task: todo.task.toUpperCase() }))
    );
  };

  const markAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => ({
        ...todo,
        isDone: todo.id === id ? true : todo.isDone,
      }))
    );
  };

  const startEditing = (id) => {
    setEditingId(id);
  };

  const saveEdit = (id, updatedTask) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, task: updatedTask };
        }
        return todo;
      })
    );
    // setEditingId(null);
  };

  return (
    <div>
      <h2>Todo App</h2>
      <input
        placeholder="Add a task"
        value={newTodo}
        onChange={updateTodoValue}
      />
      <button onClick={addNewTask}>Add Task</button>
      <br /> <br />

      <h3>Task</h3>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <span style={todo.isDone ? { textDecoration: "line-through" } : {}}>
                  {todo.task}
                </span>
                <input
                  type="text"
                  value={todo.task}
                  onChange={(e) => saveEdit(todo.id, e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id, todo.task)}>Save</button>
              </>
            ) : (
              <>
                <span style={todo.isDone ? { textDecoration: "line-through" } : {}}>
                  {todo.task}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button> <br />
                <button onClick={() => markAsDone(todo.id)}>Done</button> <br />
                <button onClick={() => startEditing(todo.id)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <br />
      <button onClick={upperCaseAll}>Uppercase</button>
    </div>
  );
}
