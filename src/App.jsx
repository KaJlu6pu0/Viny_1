import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";

const About = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.About })));
const Contact = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.Contact })));
const News = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.News })));
const Gallery = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.Gallery })));
const FAQ = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.FAQ })));
const Profile = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.Profile })));
const PostDetails = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.PostDetails })));
const Product = lazy(() => import("./Pages.jsx").then((page) => ({ default: page.Product })));

function useApi(url) {
  const [result, setResult] = useState({ url: "", data: null, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Помилка завантаження: ${response.status}`);
        return response.json();
      })
      .then((data) => setResult({ url, data, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError") setResult({ url, data: null, error: error.message });
      });
    return () => controller.abort();
  }, [url]);

  return result.url === url ? result : { data: null, error: "" };
}

function Home() {
  const { data: users, error } = useApi("https://jsonplaceholder.typicode.com/users");

  return (
    <section>
      <h1>Головна</h1>
      <h2>Користувачі</h2>
      {error && <p role="alert">{error}</p>}
      {!users && !error && <p role="status">Завантаження користувачів...</p>}
      <ul>
        {users?.map((user) => (
          <li key={user.id}><Link to={`/users/${user.id}`}>{user.name}</Link></li>
        ))}
      </ul>
    </section>
  );
}

function Posts() {
  const { data: posts, error } = useApi("https://jsonplaceholder.typicode.com/posts");
  const [userId, setUserId] = useState("");

  if (error) return <p role="alert">{error}</p>;
  if (!posts) return <p role="status">Завантаження постів...</p>;

  return (
    <section>
      <h1>Пости</h1>
      <label>
        Фільтр за ID користувача{" "}
        <select value={userId} onChange={(event) => setUserId(event.target.value)}>
          <option value="">Усі користувачі</option>
          {[...new Set(posts.map((post) => post.userId))].map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </label>
      <ul>
        {posts.filter((post) => !userId || post.userId === Number(userId)).map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link> — {post.body.slice(0, 20)}...
          </li>
        ))}
      </ul>
    </section>
  );
}

function Layout() {
  return (
    <div className="app">
      <header>
        <Link to="/" className="logo">Мій застосунок</Link>
        <nav>
          <Link to="/">Головна</Link>
          <Link to="/about">Про нас</Link>
          <Link to="/contacts">Контакти</Link>
          <Link to="/news">Новини</Link>
          <Link to="/gallery">Галерея</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/posts">Пости</Link>
          <Link to="/products/1">Товар</Link>
        </nav>
      </header>
      <main>
        <Suspense fallback={<p role="status">Завантаження...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/users/:id" element={<Profile />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:postId" element={<PostDetails />} />
            <Route path="/products/:productId" element={<Product />} />
            <Route path="*" element={<h1>Сторінку не знайдено</h1>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return <BrowserRouter><Layout /></BrowserRouter>;
}
