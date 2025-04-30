"use client";
import { useState } from 'react';
import dotenv from 'dotenv';
dotenv.config();

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', walletAddress: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:9000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Signup successful!');
        // optionally store JWT or redirect
      } else {
        setMessage(data.msg || data.error || 'Signup failed');
      }
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <input name="walletAddress" placeholder="Wallet Address" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
