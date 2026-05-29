import { add, format } from "date-fns";
import { useState } from "react";
function App() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() === "" || password.trim() === "") {
      window.alert("error empty name or password field");
      return;
    }

    const formData = {
      name: name,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        window.alert(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setName("");
      setPassword("");
    }
  };
  return (
    <>
      <div>
        Tomorrow's Date: {format(add(new Date(), { days: 1 }), "do MMMM yyyy")}
      </div>
      <div>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          placeholder="name"
          type="text"
          onChange={handleName}
        />
        <br />
        <input
          value={password}
          placeholder="password"
          type="password"
          onChange={handlePassword}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      </div>
    </>
  );
}

export default App;
