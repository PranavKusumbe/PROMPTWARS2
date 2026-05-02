import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './components/Navbar';

describe('Navbar Component', () => {
  it('renders nothing when user is not provided', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar user={null} />
      </BrowserRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when user is provided', () => {
    const user = { displayName: 'John Doe', photoURL: 'https://example.com/photo.jpg' };
    render(
      <BrowserRouter>
        <Navbar user={user} onLogout={vi.fn()} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Election')).toBeDefined();
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Process Guide')).toBeDefined();
    expect(screen.getByText('Logout')).toBeDefined();
  });
});
