import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders the LifeOS dashboard', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sleep tracker/i })).toBeInTheDocument();
  expect(screen.getByText('0/0')).toBeInTheDocument();
  expect(screen.getByText('Not logged')).toBeInTheDocument();
});

test('navigates to Sleep Tracker and saves a localStorage entry', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Sleep' }));

  expect(screen.getByRole('heading', { name: 'Sleep Tracker' })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Bedtime'), { target: { value: '22:30' } });
  fireEvent.change(screen.getByLabelText('Wake time'), { target: { value: '06:45' } });
  fireEvent.change(screen.getByLabelText('Sleep quality score'), { target: { value: '9' } });
  fireEvent.click(screen.getByRole('button', { name: /save sleep entry/i }));

  expect(screen.getByText('22:30 to 06:45')).toBeInTheDocument();
  expect(screen.getByText('Quality 9/10')).toBeInTheDocument();

  const savedEntries = JSON.parse(window.localStorage.getItem('lifeos:sleepEntries'));
  expect(savedEntries).toHaveLength(1);
  expect(savedEntries[0]).toMatchObject({
    bedtime: '22:30',
    wakeTime: '06:45',
    quality: 9,
  });
});

test('updates dashboard mood from a saved diary entry', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Diary' }));
  fireEvent.change(screen.getByLabelText('Mood'), { target: { value: 'Happy' } });
  fireEvent.change(screen.getByLabelText('Daily note'), {
    target: { value: 'Felt good after a focused morning.' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save diary entry/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));

  expect(screen.getByText('Happy')).toBeInTheDocument();
  expect(window.localStorage.getItem('lifeos:diaryEntries')).toContain('Felt good');
});
