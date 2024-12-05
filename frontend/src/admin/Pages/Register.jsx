import { useState } from 'react';

export default function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const registerUser = async (e) => {
    e.preventDefault();
    console.log("Data being sent:", data);  // Log the data before sending it
  
    try {
      const response = await fetch("http://localhost:5050/record/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (response.ok) {
        setMessage("Registration successful!");
      } else {
        setMessage(result.error || "Error registering user.");
      }
    } catch (error) {
      setMessage("Error registering user.");
      console.error("Error during registration:", error);  // Log error to console
    }
  };
  

  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <label>Email</label>
        <input
          type="email"  // Change to 'email' type
          placeholder="Enter email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
