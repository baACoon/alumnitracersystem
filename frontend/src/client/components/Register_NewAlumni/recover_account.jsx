import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './recover.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RecoverAccount = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('request'); // 'request' | 'code_sent' | 'verified'
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestCode = async () => {
    if (!email) return toast.warning('Please enter your email.');

    setLoading(true);
    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.info('Recovery code sent to your email.');
        setStep('code_sent');
      } else {
        toast.error(data.message || 'Email not found in graduates list.');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while sending the code.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) return toast.info('Please enter the 6-digit code.');

    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('recoveryToken', data.token);
        setStep('verified');
      } else {
        toast.warning(data.message || 'Invalid or expired code.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('An error occurred during verification.');
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.warning('Please fill out both password fields.');
    }
    if (newPassword !== confirmPassword) {
      return toast.warning('Passwords do not match.');
    }

    try {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
          return toast.warning("Password must include uppercase, lowercase, number, special character and be 8+ characters.");
        }

      const token = localStorage.getItem('recoveryToken');
      const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Password reset successful. You may now log in.');
        localStorage.removeItem('recoveryToken');
        navigate('/login');
      } else {
        toast.error(data.message || 'Password reset failed.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      toast.error('An error occurred while resetting password.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Recover Account</h2>

      {step === 'request' && (
        <>
          <p>Enter your registered email from your graduation record:</p>
          <input
            type="email"
            placeholder="Email (e.g. jdexample@email.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button onClick={requestCode} className={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Recovery Code'}
          </button>
        </>
      )}

      {step === 'code_sent' && (
        <>
          <p>Enter the code sent to <strong>{email}</strong>:</p>
          <input
            type="text"
            placeholder="6-digit Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.input}
          />
          <button onClick={verifyCode} className={styles.button}>
            Verify Code
          </button>
        </>
      )}

      {step === 'verified' && (
        <>
          <p>Enter your new password:</p>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
          />
          <button onClick={resetPassword} className={styles.button}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default RecoverAccount;