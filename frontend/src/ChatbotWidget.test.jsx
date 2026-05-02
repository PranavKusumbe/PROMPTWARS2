import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatbotWidget from './components/ChatbotWidget';

// Mock Dependencies
vi.mock('../firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] }))
}));

const mockSendMessage = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      startChat: vi.fn(() => ({
        sendMessage: mockSendMessage
      }))
    }))
  }))
}));

describe('ChatbotWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set mock env variable
    import.meta.env.VITE_GEMINI_API = 'test-api-key';
  });

  it('renders correctly in closed state', () => {
    render(<ChatbotWidget />);
    expect(screen.getByLabelText('Open Election Assistant Chat')).toBeInTheDocument();
  });

  it('opens and closes the chat window', () => {
    render(<ChatbotWidget />);
    const openBtn = screen.getByLabelText('Open Election Assistant Chat');
    fireEvent.click(openBtn);
    expect(screen.getByText('Election Assistant')).toBeInTheDocument();
    
    const closeBtn = screen.getByLabelText('Close Chatbot');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Election Assistant')).not.toBeInTheDocument();
  });

  it('sends a message and receives a response', async () => {
    mockSendMessage.mockResolvedValueOnce({
      response: { text: () => "This is a test response." }
    });

    render(<ChatbotWidget />);
    fireEvent.click(screen.getByLabelText('Open Election Assistant Chat'));

    const input = screen.getByLabelText('Your message');
    fireEvent.change(input, { target: { value: 'How do I vote?' } });
    fireEvent.submit(screen.getByLabelText('Send message'));

    expect(screen.getByText('How do I vote?')).toBeInTheDocument();
    expect(screen.getByText('Thinking...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('This is a test response.')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockSendMessage.mockRejectedValueOnce(new Error('API Failure'));

    render(<ChatbotWidget />);
    fireEvent.click(screen.getByLabelText('Open Election Assistant Chat'));

    const input = screen.getByLabelText('Your message');
    fireEvent.change(input, { target: { value: 'Broken link?' } });
    fireEvent.submit(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText(/I'm having trouble connecting/)).toBeInTheDocument();
    });
  });

  it('sanitizes user input', async () => {
    mockSendMessage.mockResolvedValueOnce({
      response: { text: () => "Safe response" }
    });

    render(<ChatbotWidget />);
    fireEvent.click(screen.getByLabelText('Open Election Assistant Chat'));

    const input = screen.getByLabelText('Your message');
    const maliciousInput = '<b>Bold Test</b><script>alert(1)</script>';
    fireEvent.change(input, { target: { value: maliciousInput } });
    fireEvent.submit(screen.getByLabelText('Send message'));

    // DOMPurify should strip script but keep text
    await waitFor(() => {
        expect(screen.getByText(/Bold Test/)).toBeInTheDocument();
        expect(screen.queryByText(/alert/)).not.toBeInTheDocument();
    });
  });
});
