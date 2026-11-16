import { createContext, useContext, useReducer, useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Smartphone", price: 1999 },
  { id: 2, name: "Multicooker", price: 179 },
  { id: 3, name: "Toster", price: 70 },
  { id: 4, name: "TV", price: 299 },
];

const initialTasks = [
  { id: 1, title: "Read a book", completed: false },
  { id: 2, title: "to go to the gym", completed: true },
  { id: 3, title: "to go for a walk in the evening", completed: false },
];

const AppContext = createContext(null);

function cartReducer(cart, { type, payload }) {
  switch (type) {
    case "add":
      return cart.some((item) => item.id === payload.id)
        ? cart.map((item) =>
            item.id === payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cart, { ...payload, quantity: 1 }];
    case "remove":
      return cart.filter((item) => item.id !== payload);
    case "clear":
      return [];
    default:
      return cart;
  }
}

function themeReducer(theme) {
  return theme === "light" ? "dark" : "light";
}

function todoReducer(tasks, { type, payload }) {
  switch (type) {
    case "add":
      return payload.trim()
        ? [{ id: Date.now(), title: payload.trim(), completed: false }, ...tasks]
        : tasks;
    case "toggle":
      return tasks.map((task) =>
        task.id === payload ? { ...task, completed: !task.completed } : task
      );
    case "remove":
      return tasks.filter((task) => task.id !== payload);
    case "clear":
      return tasks.filter((task) => !task.completed);
    case "toggleAll": {
      const completed = !tasks.every((task) => task.completed);
      return tasks.map((task) => ({ ...task, completed }));
    }
    default:
      return tasks;
  }
}

function AppProvider({ children }) {
  const [cart, dispatchCart] = useReducer(cartReducer, []);
  const [theme, dispatchTheme] = useReducer(themeReducer, "light");
  const [tasks, dispatchTasks] = useReducer(todoReducer, initialTasks);

  return (
    <AppContext.Provider value={{ cart, dispatchCart, theme, dispatchTheme, tasks, dispatchTasks }}>
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}

function Product({ product }) {
  const { dispatchCart } = useApp();
  return (
    <div className="product-card">
      <div>
        <h3>{product.name}</h3>
        <span>{product.price} $</span>
      </div>
      <button className="primary-button" onClick={() => dispatchCart({ type: "add", payload: product })}>
        Add to cart
      </button>
    </div>
  );
}

function CartItem({ item }) {
  const { dispatchCart } = useApp();
  return (
    <div className="cart-item">
      <div>
        <strong>{item.name}</strong>
        <span>{item.quantity} × {item.price} $</span>
      </div>
      <button className="ghost-button" onClick={() => dispatchCart({ type: "remove", payload: item.id })}>
        Remove
      </button>
    </div>
  );
}

function TodoInput() {
  const { dispatchTasks } = useApp();
  const [value, setValue] = useState("");

  function submit(event) {
    event.preventDefault();
    dispatchTasks({ type: "add", payload: value });
    setValue("");
  }

  return (
    <form className="todo-form" onSubmit={submit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Add a new task"
        aria-label="New task"
      />
      <button className="primary-button">Add</button>
    </form>
  );
}

function TodoList() {
  const { tasks, dispatchTasks } = useApp();
  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <li key={task.id} className={`todo-item${task.completed ? " completed" : ""}`}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => dispatchTasks({ type: "toggle", payload: task.id })}
            />
            <span>{task.title}</span>
          </label>
          <button className="ghost-button" onClick={() => dispatchTasks({ type: "remove", payload: task.id })}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function TodoActions() {
  const { tasks, dispatchTasks } = useApp();
  const allDone = tasks.every((task) => task.completed);
  return (
    <div className="todo-actions">
      <button className="secondary-button" onClick={() => dispatchTasks({ type: "toggleAll" })}>
        {allDone ? "Unmark all" : "Mark all complete"}
      </button>
      <button className="secondary-button" onClick={() => dispatchTasks({ type: "clear" })}>
        Clear completed
      </button>
    </div>
  );
}

function AppContent() {
  const { cart, dispatchCart, theme, dispatchTheme, tasks } = useApp();
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className={`app-shell ${theme}`}>
      <div className="container">
        <section className="panel cart-panel">
          <div className="section-header">
            <h2>Shopping</h2>
            <span>{quantity} items</span>
            <button className="theme-toggle" onClick={() => dispatchTheme()}>
              {theme === "light" ? "🌙 Dark theme" : "☀️ Light theme"}
            </button>
          </div>
          <div className="products-grid">
            {products.map((product) => <Product key={product.id} product={product} />)}
          </div>
          <div className="cart-summary">
            <div><span>Total quantity</span><strong>{quantity}</strong></div>
            <div><span>Total</span><strong>{total} $</strong></div>
          </div>
          <div className="cart-list">
            {cart.length
              ? cart.map((item) => <CartItem key={item.id} item={item} />)
              : <p className="empty-state">Your cart is empty</p>}
          </div>
          <button
            className="danger-button"
            disabled={!cart.length}
            onClick={() => dispatchCart({ type: "clear" })}
          >
            Clear cart
          </button>
        </section>

        <section className="panel todo-panel">
          <div className="section-header"><h2>List</h2><span>{tasks.length} tasks</span></div>
          <TodoInput />
          <TodoActions />
          <TodoList />
        </section>
      </div>
    </main>
  );
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
