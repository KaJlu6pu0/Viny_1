import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const CARDS = [
  {
    title: "makovoe pole",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3DejSRAo5ztLVtIpbGV7biwahbnYcOy9kKxbXJnVYstxGXmFgOhugc7s&s=10",
  },
  {
    title: "atlanic ocean",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCHi99VICv7LZOqZGKhPF_1b0rCcFs6LTzaviKl4qZpQ&s=10",
  },
  {
    title: "Forest",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTso_isAkExozdHJb7VDTpOJEmAl-ieKptLyF4lPRqFLg&s=10",
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
const buttonClass =
  "rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200";

  const PRODUCTS = [
  { id: 1, name: "TV", price: 399.99 },
  { id: 2, name: "Сolumn", price: 70.0 },
  { id: 3, name: "Grill", price: 267.99 },
  { id: 4, name: "Multicooker", price: 89.99 },
  { id: 5, name: "USB FLASH DRIVE", price: 29.99 },
];

function App() {
  const [movies, setMovies] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("https://jsonplaceholder.typicode.com/users", {
        signal: controller.signal,
      })
      .then(({ data }) => setUsers(data))
      .catch((requestError) => {
        if (!axios.isCancel(requestError)) setError("Could not load users.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  function addMovie(event) {
    event.preventDefault();
    const title = movieTitle.trim();
    if (!title) return;
    setMovies((current) => [...current, title]);
    setMovieTitle("");
  }

  const filteredProducts = PRODUCTS.filter(({ name }) =>
    name.toLowerCase().includes(productSearch.trim().toLowerCase()),
  );

  return (
    <main className="app-shell min-h-screen px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-6">

        <section className="app-card grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">1.Favorite Movies</h2>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={addMovie}>
            <label className="sr-only" htmlFor="movie-title">
              Movie title
            </label>
            <input
              className={inputClass}
              id="movie-title"
              onChange={(event) => setMovieTitle(event.target.value)}
              placeholder="Enter a movie title"
              value={movieTitle}
            />
            <button className={buttonClass} type="submit">
              Add
            </button>
          </form>
          {movies.length ? (
            <ul className="grid gap-2">
              {movies.map((movie, index) => (
                <li
                  className="app-card flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                  key={`${movie}-${index}`}
                >
                  <span>{movie}</span>
                  <button
                    aria-label={`Delete ${movie}`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                    onClick={() =>
                      setMovies((current) =>
                        current.filter((_, movieIndex) => movieIndex !== index),
                      )
                    }
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="app-muted">Empty.</p>
          )}
        </section>

        <section className="app-card grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">2. Users</h2>
          {error ? (
            <p className="text-red-600" role="alert">
              {error}
            </p>
          ) : loading ? (
            <p className="app-muted" role="status">
              Loading users…
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <li
                  className="app-card rounded-xl border border-slate-200 p-4"
                  key={user.id}
                >
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="app-muted break-all text-sm">{user.email}</p>
                  {expandedUser === user.id && (
                    <p className="app-muted mt-3 text-sm">
                      {user.address.city} · {user.company.name}
                    </p>
                  )}
                  <button
                    aria-expanded={expandedUser === user.id}
                    className={`${buttonClass} mt-4 text-sm`}
                    onClick={() =>
                      setExpandedUser(expandedUser === user.id ? null : user.id)
                    }
                    type="button"
                  >
                    {expandedUser === user.id ? "Show less" : "Show more"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="app-card grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">3. Product Search-market</h2>
          <label className="grid gap-2 font-medium">
            Search
            <input
              className={inputClass}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search products"
              value={productSearch}
            />
          </label>
          {filteredProducts.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <li
                  className="app-card flex justify-between gap-3 rounded-lg border border-slate-200 p-4"
                  key={product.id}
                >
                  <span>{product.name}</span>
                  <span className="font-semibold">${product.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="app-muted">Empty.</p>
          )}
        </section>

        <section className="app-card grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">4. Image</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card) => (
              <li
                className="app-card overflow-hidden rounded-xl border border-slate-200"
                key={card.title}
              >
                <img
                  alt={card.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                  src={card.image}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{card.title}</h3>
                  <p className="app-muted mt-2 text-sm">{card.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default App;
