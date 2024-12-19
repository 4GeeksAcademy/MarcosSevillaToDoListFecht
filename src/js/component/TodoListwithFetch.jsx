import React, { useState, useEffect } from "react";

// URLs base de la API
const apiBaseURL = "https://playground.4geeks.com/todo";
const userEndpoint = `${apiBaseURL}/users/MarcosSevilla`;
const todosEndpoint = `${apiBaseURL}/todos/MarcosSevilla`;

const ToDoListWithFetch = () => {
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [newTaskName, setNewTaskName] = useState(""); // Input de nueva tarea
  const [editTask, setEditTask] = useState(null); // Estado para editar tareas
  const [taskCompleted, setTaskCompleted] = useState(false); // Checkbox de "tarea completada"
  const [loading, setLoading] = useState(true); // Estado de carga
  const [message, setMessage] = useState({ type: null, text: null }); // Mensajes de éxito/error

  // Mostrar mensaje
  const showMessage = (type, text) => setMessage({ type, text });

  // Limpiar mensaje
  const clearMessage = () => setMessage({ type: null, text: null });

  // Crear usuario y una tarea predeterminada
  const createUserWithDefaultTask = async () => {
    try {
      await fetch(userEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      await createTask("Tarea de prueba creada");
      showMessage("success", "Usuario y tarea de prueba creados correctamente.");
    } catch {
      showMessage("error", "Error al crear el usuario y la tarea inicial.");
    }
  };

  // Crear una tarea
  const createTask = async (label) => {
    const task = { label, is_done: false };
    try {
      const response = await fetch(todosEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error();
      fetchTasks();
    } catch {
      showMessage("error", "Error al crear la tarea.");
    }
  };

  // Obtener tareas del servidor
  const fetchTasks = async () => {
    setLoading(true);
    clearMessage();
    try {
      const response = await fetch(userEndpoint);
      if (response.status === 404) {
        showMessage(
          "error",
          "Error al cargar tareas. Haz clic en el aspa para crear un usuario y una tarea predeterminada."
        );
        return;
      }
      if (!response.ok) throw new Error();
      const data = await response.json();
      setTasks(data.todos || []);
    } catch {
      showMessage("error", "Error al obtener las tareas del servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una tarea
  const updateTask = async (task) => {
    try {
      const response = await fetch(`${apiBaseURL}/todos/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error();
      fetchTasks();
    } catch {
      showMessage("error", "Error al actualizar la tarea.");
    }
  };

  // Eliminar una tarea
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${apiBaseURL}/todos/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      fetchTasks();
    } catch {
      showMessage("error", "Error al eliminar la tarea.");
    }
  };

  // Manejar la tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editTask) {
        updateTask({ ...editTask, label: newTaskName, is_done: taskCompleted });
      } else {
        createTask(newTaskName);
      }
      resetForm();
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    setEditTask(null);
    setNewTaskName("");
    setTaskCompleted(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-primary">To Do List With Fetch</h1>

      {/* Mensajes de éxito o error */}
      {message.type && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-danger"
          } d-flex justify-content-between align-items-center`}
        >
          <span>{message.text}</span>
          <button
            className="btn-close"
            onClick={() => {
              clearMessage();
              if (message.type === "error" && message.text.includes("Haz clic")) {
                createUserWithDefaultTask();
              }
            }}
          ></button>
        </div>
      )}

      {/* Formulario para agregar/editar tareas */}
      <h4 className="mt-4">{editTask ? "Editar Tarea" : "Agregar Tarea"}</h4>
      <form>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Escribe una nueva tarea y presiona Enter"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {editTask && (
          <>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                id="completed"
                className="form-check-input"
                checked={taskCompleted}
                onChange={() => setTaskCompleted(!taskCompleted)}
              />
              <label htmlFor="completed" className="form-check-label">
                Tarea Completada
              </label>
            </div>
            <div className="d-flex gap-2 mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  updateTask({ ...editTask, label: newTaskName, is_done: taskCompleted });
                  resetForm();
                }}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </form>

      {/* Lista de tareas */}
      <h2 className="mt-4 text-success">Listado de Tareas</h2>
      {loading ? (
        <p>Cargando tareas...</p>
      ) : (
        <ul className="list-group mt-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                {task.is_done ? (
                  <i className="fas fa-thumbs-up text-success me-2"></i>
                ) : (
                  <i className="fas fa-times-circle text-danger me-2"></i>
                )}
                {task.label}
              </div>
              <div>
                <i
                  className="fas fa-edit text-success me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEditTask(task);
                    setNewTaskName(task.label);
                    setTaskCompleted(task.is_done);
                  }}
                ></i>
                <i
                  className="fas fa-trash text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteTask(task.id)}
                ></i>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToDoListWithFetch;











































