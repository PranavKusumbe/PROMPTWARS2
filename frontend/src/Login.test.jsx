import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './pages/Login';
import { signInWithPopup } from 'firebase/auth';

// Mock Firebase module
vi.mock('../firebase', () => ({
  auth: { currentUser: null },
  googleProvider: {}
}));

// Mock Auth functions
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn()
}));

describe('Login Component', () => {
  it('renders login UI correctly', () => {
    render(<Login />);
    expect(screen.getByText('Election Assistant')).toBeInTheDocument();
    expect(screen.getByLabelText('Sign in with Google')).toBeInTheDocument();
  });

  it('triggers signInWithPopup on button click', async () => {
    signInWithPopup.mockResolvedValueOnce({});
    render(<Login />);
    
    const loginBtn = screen.getByLabelText('Sign in with Google');
    fireEvent.click(loginBtn);
    
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(signInWithPopup).toHaveBeenCalled();
  });

  it('displays error message on authentication failure', async () => {
    signInWithPopup.mockRejectedValueOnce(new Error('Auth failed'));
    render(<Login />);
    
    const loginBtn = screen.getByLabelText('Sign in with Google');
    fireEvent.click(loginBtn);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
    });
  });
});
