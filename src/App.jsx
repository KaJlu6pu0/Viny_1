import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments";
const THEME_STORAGE_KEY = "react-exercises-theme";
const TEXT_STORAGE_KEY = "react-exercises-text";
const COUNTER_STORAGE_KEY = "react-exercises-counter";
const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "gray", label: "Gray" },
  { value: "crimson", label: "Crimson" },
];
const inputClass =
  "rounded-lg border border-slate-300 px-3 py-2.5 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

function UserItem({ user }) {
  return (
    <li className="app-card flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40">
      <span
        aria-hidden="true"
        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700"
      >
        {user.name.trim().charAt(0).toLocaleUpperCase()}
      </span>
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-slate-900">{user.name}</h3>
        <p className="break-all text-sm text-slate-600">
          {user.email || "No email"}
        </p>
      </div>
    </li>
  );
}

function UserList({ users }) {
  return users.length ? (
    <ul className="grid gap-3 sm:grid-cols-2">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  ) : (
    <p className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-slate-500">
      No users.
    </p>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      Search
      <input
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Name…"
        type="search"
        value={value}
      />
    </label>
  );
}

function UserForm({ onAddUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a name.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onAddUser({ name: name.trim(), email });
      setName("");
      setEmail("");
    } catch {
      setError("Could not add user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="app-card rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="text-xl font-semibold">New user</h2>
      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Name
          <input
            autoComplete="name"
            className={inputClass}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            placeholder="Name"
            required
            value={name}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Email
          <input
            autoComplete="email"
            className={inputClass}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            value={email}
          />
        </label>
        <div className="sm:col-span-2">
          {error && (
            <p className="mb-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Adding…" : "Add"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ThemeSelector({ theme, onThemeChange }) {
  return (
    <section className="app-card grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <h2 className="text-xl font-semibold">Theme</h2>
        <p className="app-muted mt-1 text-sm">Your choice is saved in this browser.</p>
      </div>
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Choose a theme
        <select
          className={inputClass}
          onChange={(event) => onThemeChange(event.target.value)}
          value={theme}
        >
          {THEMES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

function TextDraft() {
  const [text, setText] = useState(
    () => window.localStorage.getItem(TEXT_STORAGE_KEY) ?? "",
  );

  useEffect(() => {
    window.localStorage.setItem(TEXT_STORAGE_KEY, text);
  }, [text]);

  return (
    <section className="app-card grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Text note</h2>
        <p className="app-muted mt-1 text-sm">
          Your text is saved automatically.
        </p>
      </div>
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Your text
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          onChange={(event) => setText(event.target.value)}
          placeholder="Enter text…"
          value={text}
        />
      </label>
    </section>
  );
}

function PersistentCounter() {
  const [count, setCount] = useState(() => {
    const savedCount = Number.parseInt(
      window.localStorage.getItem(COUNTER_STORAGE_KEY) ?? "0",
      10,
    );
    return Number.isNaN(savedCount) ? 0 : savedCount;
  });

  useEffect(() => {
    window.localStorage.setItem(COUNTER_STORAGE_KEY, String(count));
  }, [count]);

  return (
    <section className="app-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Click</h2>
        <p className="app-muted mt-1 text-sm">
          Clicks: <strong>{count}</strong>
        </p>
      </div>
      <button
        className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        onClick={() => setCount((currentCount) => currentCount + 1)}
        type="button"
      >
        Increment
      </button>
    </section>
  );
}

function CommentsList() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadComments() {
      try {
        const { data } = await axios.get(COMMENTS_URL, {
          signal: controller.signal,
        });
        setComments(data);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError("Could not load comments.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadComments();
    return () => controller.abort();
  }, []);

  return (
    <section className="app-card grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold">
        Comments{" "}
        {!isLoading && !error && (
          <span className="app-muted text-sm font-normal">
            {comments.length}
          </span>
        )}
      </h2>
      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : isLoading ? (
        <p className="app-muted py-8 text-center" role="status">
          Loading comments…
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {comments.map((comment) => (
            <li
              className="app-card rounded-xl border border-slate-200 p-4"
              key={comment.id}
            >
              <h3 className="break-all font-semibold">{comment.name}</h3>
              <p className="app-muted mt-2 text-sm">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "blue") return "gray";
    if (savedTheme === "green" || savedTheme === "dark-gray") return "crimson";
    return THEMES.some(({ value }) => value === savedTheme)
      ? savedTheme
      : "light";
  });

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const { data } = await axios.get(USERS_URL, {
          signal: controller.signal,
        });
        setUsers(data);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) setError("Could not load users.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadUsers();
    return () => controller.abort();
  }, []);

  async function addUser({ name, email }) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUsers((current) => [
      ...current,
      { id: Date.now(), name: name.trim(), email: email.trim() },
    ]);
    console.log("User added");
  }

  const filteredUsers = users.filter(({ name }) =>
    name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <main className="app-shell min-h-screen px-4 py-5 text-slate-900" data-theme={theme}>
      <div className="mx-auto grid max-w-2xl gap-3">
        <ThemeSelector theme={theme} onThemeChange={setTheme} />
        <section className="app-card grid gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <SearchBar value={search} onChange={setSearch} />
          {error ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : isLoading ? (
            <p className="app-muted py-8 text-center" role="status">
              Loading users…
            </p>
          ) : (
            <UserList users={filteredUsers} />
          )}
        </section>
        <TextDraft />
        <PersistentCounter />
        <CommentsList />
        <UserForm onAddUser={addUser} />
      </div>
    </main>
  );
}

export default App;
