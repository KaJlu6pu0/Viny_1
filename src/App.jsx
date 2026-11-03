import { useEffect, useState } from "react";
import "./App.css";

const buttonClass =
  "rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50";

const messages = [
  { id: 1, text: "Welcome.", date: "11.11.2026" },
  { id: 2, text: "Loerm Ipsum.", date: "26.06.2026" },
  { id: 3, text: "ipsum lorem.", date: "20.03.2023" },

  { id: 4, text: "loerm ipsum lorem.", date: "11.11.2011" },
  { id: 5, text: "ipsum lorem ipsum!", date: "22.02.2002" },
];

function Skeleton({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-4 w-full animate-pulse rounded-md bg-slate-300 ${className}`}
    />
  );
}

function LoginGreeting({ isLoggedIn, name }) {
  return isLoggedIn ? (
    <p>
      Welcome, <strong>{name}</strong>!
    </p>
  ) : (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <p className="text-lg">
        Welcome, <strong>{name}</strong>!
      </p>
      <button className={`${buttonClass} w-[45%] py-2.5`} type="button">
        Log in
      </button>
    </div>
  );
}

function TimedDataDemo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return loading ? (
    <div aria-label="Loading data" className="grid gap-3" role="status">
      <Skeleton className="h-6 w-[45%]" />
      <Skeleton />
      <Skeleton className="w-[65%]" />
    </div>
  ) : (
    <div>
      <h3 className="font-semibold">Data loaded</h3>
      <p>Your data is ready.</p>
    </div>
  );
}

function DataState({ data }) {
  return data === null ? (
    <div aria-label="Loading data" className="grid gap-2" role="status">
      <Skeleton />
      <Skeleton className="w-[65%]" />
    </div>
  ) : data && typeof data.title === "string" && data.title.trim() ? (
    <div>
      <h3 className="font-semibold">{data.title}</h3>
      <p>{data.description}</p>
    </div>
  ) : (
    <p>No data available.</p>
  );
}

function DataStateDemo() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setData({ title: "User profile", description: "Information loaded." }),
      2000,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="grid content-start gap-2">
        <h3 className="font-medium">{data === null ? "Loading" : "Loaded"}</h3>
        <DataState data={data} />
      </div>
      <div className="grid content-start gap-2">
        <h3 className="font-medium">Loaded example</h3>
        <DataState data={{ title: "User profile", description: "Information loaded." }} />
      </div>
      <div className="grid content-start gap-2">
        <h3 className="font-medium">Empty</h3>
        <DataState data={{}} />
      </div>
    </div>
  );
}

function UserStatus({ userStatus }) {
  return userStatus === "loading" ? (
    <div aria-label="Loading user" className="grid gap-2" role="status">
      <Skeleton />
      <Skeleton className="w-[65%]" />
    </div>
  ) : userStatus === "active" ? (
    <p>User is active.</p>
  ) : userStatus === "inactive" ? (
    <p>User is inactive.</p>
  ) : (
    <p>Unknown status.</p>
  );
}

function UserStatusDemo() {
  const [userStatus, setUserStatus] = useState("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => setUserStatus("active"), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="grid content-start gap-2">
        <h3 className="font-medium">{userStatus}</h3>
        <UserStatus userStatus={userStatus} />
      </div>
      <div className="grid content-start gap-2">
        <h3 className="font-medium">active</h3>
        <UserStatus userStatus="active" />
      </div>
      <div className="grid content-start gap-2">
        <h3 className="font-medium">inactive</h3>
        <UserStatus userStatus="inactive" />
      </div>
    </div>
  );
}

function MessagesDemo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return undefined;
    const timer = window.setTimeout(() => setLoading(false), 3000);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div className="grid gap-4">
      <button
        className={buttonClass}
        disabled={loading}
        onClick={() => setLoading(true)}
        type="button"
      >
        Refresh
      </button>
      {loading ? (
        <ul aria-label="Loading messages" className="grid gap-3" role="status">
          {Array.from({ length: 5 }, (_, index) => (
            <li
              className="grid gap-2 rounded-lg border border-slate-200 p-4"
              key={index}
            >
              <Skeleton />
              <Skeleton className="w-[65%]" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid gap-3">
          {messages.map((message) => (
            <li
              className="rounded-lg border border-slate-200 p-4"
              key={message.id}
            >
              <p>{message.text}</p>
              <time className="mt-1 block text-sm text-slate-500">
                {message.date}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-4xl gap-6">
        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">1.Login</h2>
          <div className="flex justify-center">
            <LoginGreeting isLoggedIn={false} name="User" />
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            2.Loading
          </h2>
          <TimedDataDemo />
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            3.Data states
          </h2>
          <DataStateDemo />
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            4.User status
          </h2>
          <UserStatusDemo />
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            5. Messages (3s)
          </h2>
          <MessagesDemo />
        </section>
      </div>
    </main>
  );
}

export default App;
