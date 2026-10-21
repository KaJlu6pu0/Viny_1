import { useEffect, useState } from "react";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const EMAIL_DOMAINS = ["gmail.com", "i.ua", "example.com", "outlook.com"];
const inputClass =
  "rounded-lg border border-slate-300 px-3 py-2.5 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

function alphabeticLabel(index) {
  let number = index + 1;
  let label = "";

  while (number > 0) {
    number -= 1;
    label = String.fromCharCode(65 + (number % 26)) + label;
    number = Math.floor(number / 26);
  }

  return `${label}-name`;
}

function labelUsers(users) {
  return [...users]
    .sort((a, b) =>
      a.originalName.localeCompare(b.originalName, undefined, {
        sensitivity: "base",
      }),
    )
    .map((user, index) => {
      const label = alphabeticLabel(index);
      return {
        ...user,
        name: label,
        email: `${label.toLowerCase()}@${EMAIL_DOMAINS[index % EMAIL_DOMAINS.length]}`,
      };
    });
}

function UserItem({ user }) {
  return (
    <li className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40">
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
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
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

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const { data } = await axios.get(USERS_URL, {
          signal: controller.signal,
        });
        setUsers(
          labelUsers(data.map((user) => ({ ...user, originalName: user.name }))),
        );
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
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto grid max-w-3xl gap-6">
        <header className="text-center">
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Users
          </h1>
          <p className="mt-2 text-slate-600">Find and add users.</p>
        </header>
        <UserForm onAddUser={addUser} />
        <section className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h2 className="text-xl font-semibold">
            Users{" "}
            <span className="text-sm font-normal text-slate-500">
              {isLoading ? "Loading…" : `${filteredUsers.length} found`}
            </span>
          </h2>
          <SearchBar value={search} onChange={setSearch} />
          {error ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : isLoading ? (
            <p className="py-8 text-center text-slate-500" role="status">
              Loading…
            </p>
          ) : (
            <UserList users={filteredUsers} />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
