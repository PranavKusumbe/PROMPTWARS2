import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProcessDetails from './pages/ProcessDetails';

// Mock Firebase centralized module
vi.mock('../firebase', () => ({
  db: {}
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({
    docs: [
      { id: '1', data: () => ({ title: 'Voter Registration', date: 'Jan 1 - Feb 28', description: 'Citizens register to vote. Verification of eligibility.', status: 'completed' }) }
    ]
  }))
}));

describe('ProcessDetails Component', () => {
  it('renders loading state initially', () => {
    render(<ProcessDetails />);
    expect(screen.getByText('Loading process details...')).toBeInTheDocument();
  });

  it('renders phase details after fetching', async () => {
    render(<ProcessDetails />);
    await waitFor(() => {
      expect(screen.getByText('Voter Registration')).toBeInTheDocument();
      expect(screen.getByText('Citizens register to vote. Verification of eligibility.')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });
});
