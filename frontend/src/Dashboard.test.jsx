import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './pages/Dashboard';

// Mock Firebase centralized module
vi.mock('../firebase', () => ({
  db: {}
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({
    forEach: (cb) => cb({ id: '1', data: () => ({ name: 'Test Candidate', party: 'Test Party', color: '#000', votes: 10 }) })
  }))
}));

describe('Dashboard Component', () => {
  const mockUser = { displayName: 'John Doe' };

  it('renders loading state initially', () => {
    render(<Dashboard user={mockUser} />);
    expect(screen.getByText('Loading candidates...')).toBeInTheDocument();
  });

  it('renders candidates after fetching', async () => {
    render(<Dashboard user={mockUser} />);
    await waitFor(() => {
      expect(screen.getByText('Test Candidate')).toBeInTheDocument();
    });
  });

  it('handles vote casting correctly', async () => {
    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();
    
    render(<Dashboard user={mockUser} />);
    
    const voteButton = await screen.findByLabelText(/Vote for Test Candidate/);
    fireEvent.click(voteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Your vote has been securely recorded!');
    expect(screen.getByText('Vote Recorded')).toBeInTheDocument();
  });
});
