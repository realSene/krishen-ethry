import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem(
    'lifeos:userProfile',
    JSON.stringify({
      firstName: 'Krishen',
      lastName: 'Ethry',
      email: 'krishen@example.com',
      dateOfBirth: '1998-06-17',
      age: 28,
      createdAt: '2026-06-17T00:00:00.000Z',
    }),
  );
  window.localStorage.setItem('lifeos:onboardingComplete', JSON.stringify(true));
  window.localStorage.setItem(
    'lifeos:preferences',
    JSON.stringify({
      accountType: 'local',
      storage: 'localStorage',
      savedOnDevice: true,
    }),
  );
});

test('renders the LifeOS dashboard', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sleep' })).toBeInTheDocument();
  expect(screen.getByText('Sleep tracker')).toBeInTheDocument();
  expect(screen.getByText('Habit streaks')).toBeInTheDocument();
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

  fireEvent.click(screen.getByRole('button', { name: 'Journal' }));
  fireEvent.change(screen.getByLabelText('Mood'), { target: { value: 'Happy' } });
  fireEvent.change(screen.getByLabelText('Daily note'), {
    target: { value: 'Felt good after a focused morning.' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save diary entry/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));

  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(window.localStorage.getItem('lifeos:diaryEntries')).toContain('Felt good');
});

test('opens settings and updates profile information in localStorage', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));

  expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Kris' } });

  const savedProfile = JSON.parse(window.localStorage.getItem('lifeos:userProfile'));
  expect(savedProfile.firstName).toBe('Kris');
});
