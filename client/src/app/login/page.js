'use client';

import { useState } from 'react';
import axios from 'axios'; // For email login
import { ethers } from 'ethers'; // For MetaMask login

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  // Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:9000/api/auth/login', {
        email,
        password,
      });

      alert(`Welcome ${res.data.user.username}`);
      // Store token or handle further actions here
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle MetaMask Login
  const handleMetaMaskLogin = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed');
      return;
    }

    try {
      setLoading(true);

      // Request user accounts from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the first account address
      const userAddress = accounts[0];

      // Update state with the user's address
      setAddress(userAddress);

      // Send the MetaMask address to the backend for authentication
      const response = await axios.post('http://localhost:9000/api/auth/wallet-login', {
        walletAddress: userAddress,  // Send MetaMask address to the backend
      });

      alert(`Logged in successfully! Address: ${userAddress}`);
    } catch (error) {
      console.error(error);
      alert('MetaMask login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>

      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      {/* MetaMask Login Button */}
      <button
        onClick={handleMetaMaskLogin}
        disabled={loading}
        style={{ backgroundColor: '#f6851b', color: '#fff', padding: '0.75rem', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Connecting to MetaMask...' : 'Login with MetaMask'}
      </button>

      {/* Display MetaMask Address */}
      {address && <p>Logged in with: {address}</p>}
    </div>
  );
}
