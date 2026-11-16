import { useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Read a book", completed: false },
  { id: 2, title: "Go to the gym", completed: true },
  { id: 3, title: "Take an evening walk", completed: false },
];

function TaskList({ tasks, onToggle }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <label className={task.completed ? "task completed" : "task"}>
            <input
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              type="checkbox"
            />
            {task.title}
          </label>
        </li>
      ))}
    </ul>
  );
}

function CompletedCounter({ completed, total }) {
  return (
    <p className="counter">
      Completed: <strong>{completed}</strong> of {total}
    </p>
  );
}

function TemperatureInput({ label, unit, value, onChange }) {
  return (
    <label className="temperature-input">
      {label}
      <span className="input-with-unit">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span>{unit}</span>
      </span>
    </label>
  );
}

function RatingButtons({ rating, onRate }) {
  return (
    <div className="stars" role="group" aria-label="Product rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          aria-label={`${star} out of 5`}
          aria-pressed={rating === star}
          className={star <= rating ? "star selected" : "star"}
          key={star}
          onClick={() => onRate(star)}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
  );
}

function RatingDisplay({ rating }) {
  return (
    <p className="rating-result" aria-live="polite">
      {rating ? `Rating: ${rating} out of 5` : "Rating: not selected"}
    </p>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [celsius, setCelsius] = useState("");
  const [rating, setRating] = useState(0);

  const fahrenheit = celsius === ""
    ? ""
    : String(Number((Number(celsius) * 9 / 5 + 32).toFixed(1)));
  const completed = tasks.filter((task) => task.completed).length;

  function toggleTask(id) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  }

  function changeFahrenheit(value) {
    setCelsius(value === "" ? "" : String(Number(((Number(value) - 32) * 5 / 9).toFixed(1))));
  }

  return (
    <main className="app">

      <section className="card">
        <h2>Task List</h2>
        <div className="task-layout">
          <TaskList tasks={tasks} onToggle={toggleTask} />
          <CompletedCounter completed={completed} total={tasks.length} />
        </div>
      </section>

      <section className="card">
        <h2>Temperature</h2>
        <div className="temperature-layout">
          <TemperatureInput
            label="Celsius"
            unit="°C"
            value={celsius}
            onChange={setCelsius}
          />
          <span className="conversion" aria-hidden="true">=</span>
          <TemperatureInput
            label="Fahrenheit"
            unit="°F"
            value={fahrenheit}
            onChange={changeFahrenheit}
          />
        </div>
      </section>

      <section className="card">
        <h2>Rating</h2>
        <RatingButtons rating={rating} onRate={setRating} />
        <RatingDisplay rating={rating} />
      </section>
    </main>
  );
}
