import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import ApiCalendar from 'react-google-calendar-api';

beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false
  }));

  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };

  process.env.REACT_APP_GOOGLE_CLIENT_ID = 'mock-client-id';
  process.env.REACT_APP_GOOGLE_API_KEY = 'mock-api-key';
});

// unit test for render
test('test for renders - heading', () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /Schedule to Google Calendar/i });
  expect(heading).toBeInTheDocument();
});

test('test for renders - button', () => {
  render(<App />);
  const sign_in_button = screen.getByRole("button", { name: /Sign in with Google/i });
  const sign_out_button = screen.getByRole("button", { name: /Sign out/i });
  const test_button = screen.getByRole("button", { name: /Test GCAL/i });
  const search_button = screen.getByRole("button", { name: /Search/i });
  const convert_button = screen.getByRole("button", { name: /Convert Schedule to Google Calendar/i });
  expect(sign_in_button).toBeInTheDocument();
  expect(sign_out_button).toBeInTheDocument();
  expect(test_button).toBeInTheDocument();
  expect(search_button).toBeInTheDocument();
  expect(convert_button).toBeInTheDocument();
});

test('test for renders - text', () => {
  render(<App />);
  const text1 = screen.getByText(/Enter Perm Number:/i);
  expect(text1).toBeInTheDocument();
});

test('test for render - placeholders', () => {
  render(<App />);
  const perm_input = screen.getByPlaceholderText('Perm Number');
  const quarter_input = screen.getByPlaceholderText('Quarter (YYYYQ)');
  expect(perm_input).toBeInTheDocument();
  expect(quarter_input).toBeInTheDocument();
});

// integration test
jest.mock('react-google-calendar-api');
global.fetch = jest.fn();

describe('Integration Tests', () => {
  // Mock database
  const mockDataBase = {
    "1234567": {
      "2024W": [{
        "courseId": "test_id",
        "quarter": "2024W",
        "courseTitle": "Test Course",
        "timeLocations": [{
          "days": "M W",
          "beginTime": "09:00",
          "endTime": "10:15"
        }]
      }]
    }
  };

  let mockCreateEvent = undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock createEvent()
    mockCreateEvent = jest.fn().mockResolvedValue({ 
      result: { id: 'test_event_id' } 
    });

    ApiCalendar.mockImplementation(() => ({
      handleAuthClick: jest.fn().mockResolvedValue(true),
      createEvent: mockCreateEvent,
      listEvents: jest.fn().mockResolvedValue({ result: { items: [] } })
    }));

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockDataBase)
    });
  });

  test('Integration test: login - input - convert', async () => {
    render(<App />);

    // 1. Login
    const signInButton = screen.getByRole('button', { name: /Sign in with Google/i });
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      const mockApiCalendar = ApiCalendar.mock.results[0].value;
      expect(mockApiCalendar.handleAuthClick).toHaveBeenCalled();
    });

    // 2. Input perm and quarter
    fireEvent.change(screen.getByPlaceholderText('Perm Number'), {
      target: { value: '1234567' }
    });
    fireEvent.change(screen.getByPlaceholderText('Quarter (YYYYQ)'), {
      target: { value: '2024W' }
    });

    // 3. Search and check
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/database.json');
      expect(mockCreateEvent).toHaveBeenCalled();
      const eventData = mockCreateEvent.mock.calls[0][0];
      expect(eventData).toEqual(expect.objectContaining({
        summary: expect.stringContaining('Test Course'),
        recurrence: [expect.stringContaining('BYDAY=MO,WE')],
        start: expect.objectContaining({timeZone: "America/Los_Angeles"}),
        end: expect.objectContaining({timeZone: "America/Los_Angeles"})
      }));
    });
  });
});