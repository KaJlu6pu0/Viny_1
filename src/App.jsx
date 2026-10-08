import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [reaction, setReaction] = useState("");
  const [mood, setMood] = useState("");

  return (
    <main className="flex flex-col items-center gap-8 p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="text-2xl font-semibold">Кількість кліків: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 active:scale-95"
        >
          Click
        </button>
      </div>

      <p>-------------------------------------</p>

      <div className="flex gap-3">
        <button
          onClick={() => setReaction("like")}
          className={`rounded px-4 py-2 transition hover:brightness-110 active:scale-95 ${reaction === "like" ? "bg-green-500 text-white" : "bg-green-200 hover:bg-green-300"}`}
        >
          ❤️ Like
        </button>
        <button
          onClick={() => setReaction("dislike")}
          className={`rounded px-4 py-2 transition hover:brightness-110 active:scale-95 ${reaction === "dislike" ? "bg-red-500 text-white" : "bg-red-200 hover:bg-red-300"}`}
        >
          👎 Dislike
        </button>
      </div>

      <p>------------------------------------</p>

      <div className="flex gap-3">
        <button onClick={() => setMood("😄 Funny!")} className="rounded bg-yellow-200 p-3 text-3xl transition hover:scale-110">😄</button>
        <button onClick={() => setMood("😐 Neutraly.")} className="rounded bg-slate-200 p-3 text-3xl transition hover:scale-110">😐</button>
        <button onClick={() => setMood("😢 Saddy!")} className="rounded bg-sky-200 p-3 text-3xl transition hover:scale-110">😢</button>
      </div>
      <p>{mood}</p>
    </main>
  );
}

export default App;

