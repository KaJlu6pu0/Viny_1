import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Send Name"),
  email: yup.string().required("Send Email").email("Invalid email"),
});

function App() {
  const [text, setText] = useState("");
  const [noSpaces, setNoSpaces] = useState("");
  const [country, setCountry] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [alertFormData, setAlertFormData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [validatedData, setValidatedData] = useState(null);

  const form = useForm();
  const validatedForm = useForm({ resolver: yupResolver(schema) });

  function showFormData(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = { name: data.get("name"), email: data.get("email") };
    setAlertFormData(values);
    alert(`Name: ${values.name}\nEmail: ${values.email}`);
  }

  return (
    <main className="mx-auto grid max-w-xl gap-5 p-6 text-slate-900">

      <section className="grid gap-2">
        <h2 className="font-semibold">1. onClick</h2>
        <button
          className="w-fit rounded bg-indigo-600 px-3 py-2 text-white"
          onClick={() => alert("Clicked button")}
          type="button"
        >
          Click
        </button>
      </section>

      <section className="grid gap-2">
        <h2 className="font-semibold">2. onChange</h2>
        <input
          className="rounded border p-2"
          onChange={(event) => setText(event.target.value)}
          placeholder="enter text"
          value={text}
        />
        <p>{text}</p>
      </section>

      <section className="grid gap-2">
        <h2 className="font-semibold">3.Form</h2>
        <form className="grid gap-2" onSubmit={showFormData}>
          <input className="rounded border p-2" name="name" placeholder="Name" required />
          <input className="rounded border p-2" name="email" placeholder="Email" required type="email" />
          <button className="w-fit rounded bg-indigo-600 px-3 py-2 text-white">
            Send
          </button>
        </form>
        {alertFormData && (
          <p>Your name and email: {alertFormData.name}, {alertFormData.email}</p>
        )}
      </section>

      <section className="grid gap-2">
        <h2 className="font-semibold">4.dont a space</h2>
        <input
          className="rounded border p-2"
          onChange={(event) => setNoSpaces(event.target.value.replace(/\s/g, ""))}
          value={noSpaces}
        />
      </section>

      <section className="grid gap-2">
        <h2 className="font-semibold">5.Сountry and confirmation</h2>
        <select
          className="rounded border p-2"
          onChange={(event) => setCountry(event.target.value)}
          value={country}
        >
          <option value="">Choose a country</option>
          <option>Ukraine</option>
          <option>USA</option>
          <option>England</option>
        </select>
        <label>
          <input
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            type="checkbox"
          />{" "}
          I agree
        </label>
        <p>Country: {country || "not selected"}; Agreement: {agreed ? "yes" : "no"}</p>
      </section>

      <section className="grid gap-2">
        <h2 className="font-semibold">6.Form (react-hook)</h2>
        <form
          className="grid gap-2"
          onSubmit={form.handleSubmit((data) => {
            setFormData(data);
            console.log(data);
          })}
        >
          <input className="rounded border p-2" placeholder="Name" {...form.register("name")} />
          <input className="rounded border p-2" placeholder="Email" {...form.register("email")} />
          <button className="w-fit rounded bg-indigo-600 px-3 py-2 text-white">
            Send
          </button>
        </form>
        {formData && <p>Your name and email: {formData.name}, {formData.email}</p>}
      </section>

      <section className="grid gap-2">
        <h2 className="font-semibold">7.Form (react-hook + yup)</h2>
        <form
          className="grid gap-2"
          noValidate
          onSubmit={validatedForm.handleSubmit((data) => {
            setValidatedData(data);
            console.log(data);
          })}
        >
          <input className="rounded border p-2" placeholder="Name" {...validatedForm.register("name")} />
          <p className="text-sm text-red-600">{validatedForm.formState.errors.name?.message}</p>
          <input className="rounded border p-2" placeholder="Email" {...validatedForm.register("email")} />
          <p className="text-sm text-red-600">{validatedForm.formState.errors.email?.message}</p>
          <button className="w-fit rounded bg-indigo-600 px-3 py-2 text-white">
            Send
          </button>
        </form>
        {validatedData && (
          <p>Your name and email: {validatedData.name}, {validatedData.email}</p>
        )}
      </section>
    </main>
  );
}

export default App;
