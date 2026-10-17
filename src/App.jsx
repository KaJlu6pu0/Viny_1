import { useState } from "react";

function UserCard({ user }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4 dark:border-slate-700">
      <span className={`h-3 w-3 rounded-full ${user.isOnline ? "bg-green-500" : "bg-gray-400"}`} />
      <p>{user.name}, {user.age}</p>
    </div>
  );
}

function CounterButton() {
  const [count, setCount] = useState(0);

  return (
    <button
      className="w-full rounded-xl bg-indigo-600 p-3 text-white hover:bg-indigo-700"
      onClick={() => setCount((value) => value + 1)}
    >
      Your Clicked {count}
    </button>
  );
}

function LoginForm() {
  return (
    <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
      <input className="rounded-lg border bg-white p-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white" type="email" placeholder="Email" />
      <input className="rounded-lg border bg-white p-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white" type="password" placeholder="Password" />
      <button className="rounded-lg bg-blue-600 p-2 text-white shadow transition hover:bg-blue-700 hover:shadow-xl">
        Log in
      </button>
    </form>
  );
}
function ResponsiveMessage() {
  return (
    <p>
      <span className="text-sm text-green-700 sm:hidden">mobile</span>
      <span className="hidden text-2xl text-blue-700 sm:inline">desktop</span>
    </p>
  );
}

function InteractiveCard() {
  return (
    <div className="group flex flex-col items-center rounded-xl bg-slate-100 p-4 text-center transition-colors hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700">
      <p className="mb-3 transition group-hover:[text-shadow:0_2px_8px_gray]">
        Hover(dark background "cards")
      </p>
      <button className="rounded-lg bg-slate-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600">
        Focus button(clicked)
      </button>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <main className="min-h-screen bg-slate-50 p-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
        <div className="mx-auto grid max-w-xl gap-4">
          <header className="flex items-center justify-between">
            <button className="rounded border px-3 py-2" onClick={() => setDark((value) => !value)}>
              {dark ? "Light mode" : "Dark mode"}
            </button>
          </header>
          <section className="grid gap-2 rounded-xl bg-green-100 p-4 dark:bg-green-950">
            <h2 className="font-bold">1. User/Age</h2>
            <UserCard user={{ name: "Daniil", age: 18, isOnline: true }} />
          </section>
          <section className="grid gap-2 rounded-xl bg-green-100 p-4 dark:bg-green-950">
            <h2 className="font-bold">2. Clicks</h2>
            <CounterButton />
          </section>
          <section className="grid gap-2 rounded-xl bg-green-100 p-4 dark:bg-green-950">
            <h2 className="font-bold">3. Email form</h2>
            <LoginForm />
          </section>
          <section className="grid gap-2 rounded-xl bg-green-100 p-4 dark:bg-green-950">
            <h2 className="font-bold">4. Desktop/Mobile?</h2>
            <div className="text-center">
              <ResponsiveMessage />
            </div>
          </section>
          <section className="grid gap-2 rounded-xl bg-green-100 p-4 dark:bg-green-950">
            <h2 className="font-bold">5. Hover and focus(in the dark) </h2>
            <InteractiveCard />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
