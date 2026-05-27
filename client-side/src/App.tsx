import { add, format } from "date-fns"
import { useState } from 'react'
function App() {
  const [name, setName] = useState<string>("")

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() === "") {
      window.alert("error empty name field")
      return
    }

    const formData = {
      name: name
    }
    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
    <div>Tomorrow's Date: {format(add(new Date(), { days: 1}), "do MMMM yyyy")}</div>
    <form onSubmit={handleSubmit}>
      <input
        placeholder="name"
        type="text"
        onChange={handleName}
        />

      <button type="submit">
      Submit
      </button>
    </form>
    </>
  )
}

export default App
