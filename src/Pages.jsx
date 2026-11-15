import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

export function About() {
  return <section><h1>Про нас</h1></section>;
}

export function Contact() {
  return <section><h1>Контакти</h1></section>;
}

export function News() {
  return <section><h1>Новини</h1></section>;
}

export function Gallery() {
  return <section><h1>Галерея</h1></section>;
}

export function FAQ() {
  return <section><h1>FAQ</h1></section>;
}

export function Profile() {
  const { id } = useParams();
  const { data: user, error: userError } = useApi(`https://jsonplaceholder.typicode.com/users/${id}`);
  const { data: posts, error: postsError } = useApi(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);

  if (userError || postsError) return <p role="alert">{userError || postsError}</p>;
  if (!user) return <p role="status">Завантаження профілю...</p>;

  return (
    <section>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Компанія: {user.company.name}</p>
      <p>Адреса: {user.address.street}, {user.address.city}</p>
      <h2>Пости користувача</h2>
      {!posts ? <p role="status">Завантаження постів...</p> : (
        <ul>{posts.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
      )}
    </section>
  );
}

export function PostDetails() {
  const { postId } = useParams();
  const { data: post, error: postError } = useApi(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  const { data: comments, error: commentsError } = useApi(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);

  if (postError || commentsError) return <p role="alert">{postError || commentsError}</p>;
  if (!post) return <p role="status">Завантаження поста...</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <h2>Коментарі</h2>
      {!comments ? <p role="status">Завантаження коментарів...</p> : (
        <ul>{comments.map((comment) => (
          <li key={comment.id}><strong>{comment.name}</strong>: {comment.body}</li>
        ))}</ul>
      )}
    </article>
  );
}

export function Product() {
  const { productId } = useParams();
  return <section><h1>Товар {productId}</h1></section>;
}
