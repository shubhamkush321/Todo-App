import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import './App.css';

export default function TodoList() {
  // State to store the list of todos, initializing from localStorage if available
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  // State to manage the new todo task input
  const [newTodo, setNewTodo] = useState("");

  // State to manage the new todo deadline input
  const [newDeadline, setNewDeadline] = useState("");

  // State to track the id of the todo being edited
  const [editingId, setEditingId] = useState(null);

  // State to store the last deleted todo for undo functionality
  const [deletedTodo, setDeletedTodo] = useState(null);

  // Effect to save todos to localStorage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Function to add a new task to the todos list
  const addNewTask = () => {
    if (newTodo && newDeadline) {
      setTodos((prevTodos) => [
        ...prevTodos,
        { task: newTodo, deadline: newDeadline, id: uuidv4(), isDone: false },
      ]);
      setNewTodo(""); // Clear the task input
      setNewDeadline(""); // Clear the deadline input
    }
  };

  // Function to update the new todo task input value
  const updateTodoValue = (event) => {
    setNewTodo(event.target.value);
  };

  // Function to update the new todo deadline input value
  const updateDeadlineValue = (event) => {
    setNewDeadline(event.target.value);
  };

  // Function to delete a todo and store it for potential undo
  const deleteTodo = (id) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    setDeletedTodo(todoToDelete);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Function to undo the last deleted todo
  const undoDelete = () => {
    if (deletedTodo) {
      setTodos((prevTodos) => [...prevTodos, deletedTodo]);
      setDeletedTodo(null); // Clear the deletedTodo state
    }
  };

  // Function to convert all todo tasks to uppercase
  const upperCaseAll = () => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => ({ ...todo, task: todo.task.toUpperCase() }))
    );
  };

  // Function to mark a todo as done
  const markAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => ({
        ...todo,
        isDone: todo.id === id ? true : todo.isDone,
      }))
    );
  };

  // Function to start editing a todo
  const startEditing = (id) => {
    setEditingId(id);
  };

  // Function to save the edited todo task
  const saveEdit = (id, updatedTask) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, task: updatedTask };
        }
        return todo;
      })
    );
    setEditingId(null); // Clear the editingId state
  };

  // Function to check if a deadline is overdue
  const isOverdue = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return now > deadlineDate;
  };

  return (
    <div>
      <h2>Todo App</h2>
      <input
        placeholder="Add a task"
        value={newTodo}
        onChange={updateTodoValue}
      />
      <input
        type="datetime-local"
        value={newDeadline}
        onChange={updateDeadlineValue}
      />
      <button onClick={addNewTask}>Add Task</button>
      <br /> <br />

      <h3>Task</h3>

      <ul>
        {todos.map((todo) => {
          // Determine if the task is overdue
          const overdue = isOverdue(todo.deadline);

          // Set the task style based on whether it is done or overdue
          const taskStyle = todo.isDone
            ? { backgroundColor: "#90EE90" } // Light green for done tasks
            : overdue
            ? { backgroundColor: "#FF817E" } // Light red for overdue tasks
            : {};

          return (
            <li key={todo.id} style={taskStyle}>
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
                  <span> (Deadline: {new Date(todo.deadline).toLocaleString()})</span>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button> <br />
                  <button onClick={() => markAsDone(todo.id)}>Done</button> <br />
                  <button onClick={() => startEditing(todo.id)}>Edit</button>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <br />
      <button onClick={upperCaseAll}>Uppercase</button>
      {deletedTodo && (
        <>
          <button onClick={undoDelete} id="undo">Undo Delete</button>
        </>
      )}
    </div>
  );
}
