import { useState } from 'react';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const loginAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/record/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Login successful!");
        console.log("Token:", result.token); // Store token for authenticated requests
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("Error logging in.");
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={loginAdmin}>
        <label>Email</label>
        <input
          type="text"
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
