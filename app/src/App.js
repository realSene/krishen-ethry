import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  BedDouble,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  Dumbbell,
  Flame,
  LayoutDashboard,
  LineChart,
  Moon,
  NotebookPen,
  PiggyBank,
  Plus,
  Salad,
  Send,
  SmilePlus,
  Target,
} from 'lucide-react';
import './App.css';

const STORAGE_KEYS = {
  sleep: 'lifeos:sleepEntries',
  workouts: 'lifeos:workouts',
  meals: 'lifeos:meals',
  habits: 'lifeos:habits',
  transactions: 'lifeos:transactions',
  goals: 'lifeos:goals',
  diary: 'lifeos:diaryEntries',
  coach: 'lifeos:coachMessages',
};

const navigationItems = [
  { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
  { label: 'Sleep', view: 'sleep', icon: Moon },
  { label: 'Gym', view: 'gym', icon: Dumbbell },
  { label: 'Nutrition', view: 'nutrition', icon: Salad },
  { label: 'Habits', view: 'habits', icon: CalendarCheck2 },
  { label: 'Finance', view: 'finance', icon: PiggyBank },
  { label: 'Goals', view: 'goals', icon: Target },
  { label: 'Diary', view: 'diary', icon: NotebookPen },
  { label: 'AI Coach', view: 'coach', icon: Bot },
];

const modules = [
  {
    name: 'Sleep Tracker',
    view: 'sleep',
    subtitle: 'Review sleep quality, bedtime consistency, and recovery.',
    icon: BedDouble,
    accent: 'cyan',
  },
  {
    name: 'Gym & Workouts',
    view: 'gym',
    subtitle: 'Track training sessions, volume, and weekly progress.',
    icon: Dumbbell,
    accent: 'blue',
  },
  {
    name: 'Nutrition',
    view: 'nutrition',
    subtitle: 'Log meals, macros, hydration, and daily intake trends.',
    icon: Salad,
    accent: 'green',
  },
  {
    name: 'Habits',
    view: 'habits',
    subtitle: 'Build streaks around routines that compound over time.',
    icon: CalendarCheck2,
    accent: 'violet',
  },
  {
    name: 'Finance',
    view: 'finance',
    subtitle: 'Monitor budgets, savings goals, and spending patterns.',
    icon: LineChart,
    accent: 'gold',
  },
  {
    name: 'Goals',
    view: 'goals',
    subtitle: 'Break big ambitions into measurable next actions.',
    icon: Target,
    accent: 'rose',
  },
  {
    name: 'Mood & Diary',
    view: 'diary',
    subtitle: 'Capture reflections, mood signals, and personal notes.',
    icon: NotebookPen,
    accent: 'cyan',
  },
  {
    name: 'AI Coach',
    view: 'coach',
    subtitle: 'Get personalized feedback, prompts, and daily guidance.',
    icon: Bot,
    accent: 'blue',
  },
];

const viewStyles = {
  stack: {
    display: 'grid',
    gap: 18,
  },
  panel: {
    border: '1px solid var(--border)',
    borderRadius: 22,
    background:
      'linear-gradient(145deg, rgba(12, 37, 68, 0.72), rgba(3, 6, 13, 0.42)), var(--panel)',
    boxShadow: 'var(--shadow)',
    backdropFilter: 'blur(22px)',
    padding: 22,
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.12rem',
    fontWeight: 800,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  field: {
    display: 'grid',
    gap: 7,
    color: 'var(--soft)',
    fontSize: '0.88rem',
    fontWeight: 700,
  },
  input: {
    width: '100%',
    minHeight: 44,
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text)',
    background: 'rgba(3, 6, 13, 0.62)',
    padding: '0 13px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    minHeight: 148,
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text)',
    background: 'rgba(3, 6, 13, 0.62)',
    padding: 13,
    outline: 'none',
    resize: 'vertical',
  },
  buttonRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 16,
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    gap: 9,
    padding: '0 16px',
    border: '1px solid rgba(109, 231, 255, 0.26)',
    borderRadius: 999,
    color: 'var(--text)',
    background: 'rgba(22, 139, 255, 0.16)',
    cursor: 'pointer',
  },
  logList: {
    display: 'grid',
    gap: 12,
    marginTop: 18,
  },
  logItem: {
    display: 'grid',
    gap: 6,
    border: '1px solid rgba(121, 199, 255, 0.14)',
    borderRadius: 16,
    background: 'rgba(3, 6, 13, 0.44)',
    padding: 16,
  },
  logMeta: {
    color: 'var(--muted)',
    fontSize: '0.9rem',
  },
  inlineActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  empty: {
    margin: 0,
    color: 'var(--muted)',
  },
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

function getLocalDateKey(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatSavedAt(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function readStorageValue(key, fallback) {
  try {
    const savedValue = window.localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
}

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => readStorageValue(key, initialValue));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function getHabitStreak(habit, todayKey) {
  let streak = 0;
  const cursor = new Date(`${todayKey}T00:00:00`);

  while (habit.completions?.[getLocalDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function Field({ label, children, fullWidth = false }) {
  return (
    <label style={{ ...viewStyles.field, ...(fullWidth ? viewStyles.fullWidth : {}) }}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ children }) {
  return <p style={viewStyles.empty}>{children}</p>;
}

function ModuleHeader({ eyebrow, title, subtitle, onBack }) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="date-line">{subtitle}</p>
      </div>
      <button className="insight-button" type="button" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        <span>Back</span>
      </button>
    </header>
  );
}

function DashboardView({ userName, today, stats, onModuleClick }) {
  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Main dashboard</p>
          <h1>Welcome back, {userName}</h1>
          <p className="date-line">{today}</p>
        </div>
        <button className="insight-button" type="button">
          <BarChart3 size={18} aria-hidden="true" />
          <span>Weekly insight</span>
        </button>
      </header>

      <section className="stats-bar" aria-label="Quick stats">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-pill" key={label}>
            <span className="stat-icon">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          </div>
        ))}
      </section>

      <section className="module-grid" aria-label="LifeOS modules">
        {modules.map(({ name, subtitle, icon: Icon, accent, view }) => (
          <button
            className={`module-card accent-${accent}`}
            key={name}
            type="button"
            onClick={() => onModuleClick(view, name)}
          >
            <span className="module-icon">
              <Icon size={26} aria-hidden="true" />
            </span>
            <span className="module-copy">
              <span className="module-title">{name}</span>
              <span className="module-subtitle">{subtitle}</span>
            </span>
          </button>
        ))}
      </section>
    </>
  );
}

function SleepView({ entries, setEntries, onBack }) {
  const [form, setForm] = useState({ bedtime: '', wakeTime: '', quality: '8' });

  function handleSubmit(event) {
    event.preventDefault();

    const entry = {
      id: createId('sleep'),
      ...form,
      quality: Number(form.quality),
      createdAt: new Date().toISOString(),
    };

    setEntries((currentEntries) => [entry, ...currentEntries]);
    setForm({ bedtime: '', wakeTime: '', quality: '8' });
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Sleep Tracker"
        title="Sleep Tracker"
        subtitle="Log bedtime, wake time, and your sleep quality score."
        onBack={onBack}
      />

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>New sleep entry</h2>
        <form onSubmit={handleSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Bedtime">
              <input
                required
                style={viewStyles.input}
                type="time"
                value={form.bedtime}
                onChange={(event) => setForm({ ...form, bedtime: event.target.value })}
              />
            </Field>
            <Field label="Wake time">
              <input
                required
                style={viewStyles.input}
                type="time"
                value={form.wakeTime}
                onChange={(event) => setForm({ ...form, wakeTime: event.target.value })}
              />
            </Field>
            <Field label="Sleep quality score">
              <input
                required
                max="10"
                min="1"
                style={viewStyles.input}
                type="number"
                value={form.quality}
                onChange={(event) => setForm({ ...form, quality: event.target.value })}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Save sleep entry</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Sleep log">
        {entries.length === 0 ? (
          <EmptyState>No sleep entries yet.</EmptyState>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} style={viewStyles.logItem}>
              <strong>
                {entry.bedtime} to {entry.wakeTime}
              </strong>
              <span style={viewStyles.logMeta}>Quality {entry.quality}/10</span>
              <span style={viewStyles.logMeta}>Saved {formatSavedAt(entry.createdAt)}</span>
            </article>
          ))
        )}
      </LogPanel>
    </div>
  );
}

function GymView({ workouts, setWorkouts, onBack }) {
  const [form, setForm] = useState({ exercise: '', sets: '', reps: '', weight: '' });

  function handleSubmit(event) {
    event.preventDefault();

    const workout = {
      id: createId('workout'),
      exercise: form.exercise.trim(),
      sets: Number(form.sets),
      reps: Number(form.reps),
      weight: Number(form.weight),
      createdAt: new Date().toISOString(),
    };

    setWorkouts((currentWorkouts) => [workout, ...currentWorkouts]);
    setForm({ exercise: '', sets: '', reps: '', weight: '' });
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Gym & Workouts"
        title="Gym & Workouts"
        subtitle="Track exercises, sets, reps, and weight in kilograms."
        onBack={onBack}
      />

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>New workout</h2>
        <form onSubmit={handleSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Exercise name">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={form.exercise}
                onChange={(event) => setForm({ ...form, exercise: event.target.value })}
              />
            </Field>
            <Field label="Sets">
              <input
                required
                min="1"
                style={viewStyles.input}
                type="number"
                value={form.sets}
                onChange={(event) => setForm({ ...form, sets: event.target.value })}
              />
            </Field>
            <Field label="Reps">
              <input
                required
                min="1"
                style={viewStyles.input}
                type="number"
                value={form.reps}
                onChange={(event) => setForm({ ...form, reps: event.target.value })}
              />
            </Field>
            <Field label="Weight in kg">
              <input
                required
                min="0"
                step="0.5"
                style={viewStyles.input}
                type="number"
                value={form.weight}
                onChange={(event) => setForm({ ...form, weight: event.target.value })}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Save workout</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Workout log">
        {workouts.length === 0 ? (
          <EmptyState>No workouts logged yet.</EmptyState>
        ) : (
          workouts.map((workout) => (
            <article key={workout.id} style={viewStyles.logItem}>
              <strong>{workout.exercise}</strong>
              <span style={viewStyles.logMeta}>
                {workout.sets} sets x {workout.reps} reps at {workout.weight} kg
              </span>
              <span style={viewStyles.logMeta}>Saved {formatSavedAt(workout.createdAt)}</span>
            </article>
          ))
        )}
      </LogPanel>
    </div>
  );
}

function NutritionView({ meals, setMeals, onBack }) {
  const [form, setForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  function handleSubmit(event) {
    event.preventDefault();

    const meal = {
      id: createId('meal'),
      name: form.name.trim(),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
      createdAt: new Date().toISOString(),
    };

    setMeals((currentMeals) => [meal, ...currentMeals]);
    setForm({ name: '', calories: '', protein: '', carbs: '', fats: '' });
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Nutrition"
        title="Nutrition"
        subtitle="Log meals with calories and macro split."
        onBack={onBack}
      />

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>New meal</h2>
        <form onSubmit={handleSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Meal name">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </Field>
            <Field label="Calories">
              <input
                required
                min="0"
                style={viewStyles.input}
                type="number"
                value={form.calories}
                onChange={(event) => setForm({ ...form, calories: event.target.value })}
              />
            </Field>
            <Field label="Protein">
              <input
                required
                min="0"
                style={viewStyles.input}
                type="number"
                value={form.protein}
                onChange={(event) => setForm({ ...form, protein: event.target.value })}
              />
            </Field>
            <Field label="Carbs">
              <input
                required
                min="0"
                style={viewStyles.input}
                type="number"
                value={form.carbs}
                onChange={(event) => setForm({ ...form, carbs: event.target.value })}
              />
            </Field>
            <Field label="Fats">
              <input
                required
                min="0"
                style={viewStyles.input}
                type="number"
                value={form.fats}
                onChange={(event) => setForm({ ...form, fats: event.target.value })}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Save meal</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Meal log">
        {meals.length === 0 ? (
          <EmptyState>No meals logged yet.</EmptyState>
        ) : (
          meals.map((meal) => (
            <article key={meal.id} style={viewStyles.logItem}>
              <strong>{meal.name}</strong>
              <span style={viewStyles.logMeta}>{meal.calories} calories</span>
              <span style={viewStyles.logMeta}>
                Protein {meal.protein}g, carbs {meal.carbs}g, fats {meal.fats}g
              </span>
            </article>
          ))
        )}
      </LogPanel>
    </div>
  );
}

function HabitsView({ habits, setHabits, todayKey, onBack }) {
  const [habitName, setHabitName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = habitName.trim();

    if (!trimmedName) {
      return;
    }

    setHabits((currentHabits) => [
      { id: createId('habit'), name: trimmedName, completions: {} },
      ...currentHabits,
    ]);
    setHabitName('');
  }

  function toggleHabit(habitId) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const completions = { ...(habit.completions || {}) };

        if (completions[todayKey]) {
          delete completions[todayKey];
        } else {
          completions[todayKey] = true;
        }

        return { ...habit, completions };
      }),
    );
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Habits"
        title="Habits"
        subtitle="Add habits, check them off daily, and build streaks."
        onBack={onBack}
      />

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>New habit</h2>
        <form onSubmit={handleSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Habit name" fullWidth>
              <input
                required
                style={viewStyles.input}
                type="text"
                value={habitName}
                onChange={(event) => setHabitName(event.target.value)}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Add habit</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Today">
        {habits.length === 0 ? (
          <EmptyState>No habits added yet.</EmptyState>
        ) : (
          habits.map((habit) => {
            const isDone = Boolean(habit.completions?.[todayKey]);
            const streak = getHabitStreak(habit, todayKey);

            return (
              <article key={habit.id} style={viewStyles.logItem}>
                <div style={viewStyles.inlineActions}>
                  <input
                    aria-label={`Mark ${habit.name} as done today`}
                    checked={isDone}
                    onChange={() => toggleHabit(habit.id)}
                    type="checkbox"
                  />
                  <strong>{habit.name}</strong>
                </div>
                <span style={viewStyles.logMeta}>
                  {isDone ? 'Done today' : 'Not done today'} - {streak} day streak
                </span>
              </article>
            );
          })
        )}
      </LogPanel>
    </div>
  );
}

function FinanceView({ transactions, setTransactions, onBack }) {
  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
  });

  const balance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);

  function handleSubmit(event) {
    event.preventDefault();

    const transaction = {
      id: createId('transaction'),
      type: form.type,
      amount: Number(form.amount),
      category: form.category.trim(),
      description: form.description.trim(),
      createdAt: new Date().toISOString(),
    };

    setTransactions((currentTransactions) => [transaction, ...currentTransactions]);
    setForm({ type: 'income', amount: '', category: '', description: '' });
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Finance"
        title="Finance"
        subtitle="Track income, expenses, and current balance."
        onBack={onBack}
      />

      <section className="stats-bar" aria-label="Finance stats">
        <div className="stat-pill">
          <span className="stat-icon">
            <PiggyBank size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{currencyFormatter.format(balance)}</strong>
            <small>Total balance</small>
          </span>
        </div>
      </section>

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>New transaction</h2>
        <form onSubmit={handleSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Type">
              <select
                style={viewStyles.input}
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </Field>
            <Field label="Amount">
              <input
                required
                min="0"
                step="0.01"
                style={viewStyles.input}
                type="number"
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
              />
            </Field>
            <Field label="Category">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
            </Field>
            <Field label="Description">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Save transaction</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Transactions">
        {transactions.length === 0 ? (
          <EmptyState>No transactions logged yet.</EmptyState>
        ) : (
          transactions.map((transaction) => (
            <article key={transaction.id} style={viewStyles.logItem}>
              <strong>
                {transaction.type === 'income' ? '+' : '-'}
                {currencyFormatter.format(transaction.amount)} - {transaction.category}
              </strong>
              <span style={viewStyles.logMeta}>{transaction.description}</span>
              <span style={viewStyles.logMeta}>Saved {formatSavedAt(transaction.createdAt)}</span>
            </article>
          ))
        )}
      </LogPanel>
    </div>
  );
}

function GoalsView({ goals, setGoals, todayKey, onBack }) {
  const [form, setForm] = useState({ title: '', category: '', deadline: '' });

  function handleSubmit(event) {
    event.preventDefault();

    const goal = {
      id: createId('goal'),
      title: form.title.trim(),
      category: form.category.trim(),
      deadline: form.deadline,
      status: 'not started',
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setGoals((currentGoals) => [goal, ...currentGoals]);
    setForm({ title: '', category: '', deadline: '' });
  }

  function updateGoalStatus(goalId, status) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              status,
              completedAt: status === 'completed' ? todayKey : null,
            }
          : goal,
      ),
    );
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Goals"
        title="Goals"
        subtitle="Create goals, set deadlines, and update their progress."
        onBack={onBack}
      />

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>New goal</h2>
        <form onSubmit={handleSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Goal title">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Field>
            <Field label="Category">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
            </Field>
            <Field label="Deadline">
              <input
                required
                style={viewStyles.input}
                type="date"
                value={form.deadline}
                onChange={(event) => setForm({ ...form, deadline: event.target.value })}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Add goal</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Goal list">
        {goals.length === 0 ? (
          <EmptyState>No goals added yet.</EmptyState>
        ) : (
          goals.map((goal) => (
            <article key={goal.id} style={viewStyles.logItem}>
              <strong>{goal.title}</strong>
              <span style={viewStyles.logMeta}>
                {goal.category} - deadline {goal.deadline}
              </span>
              <Field label="Progress">
                <select
                  style={viewStyles.input}
                  value={goal.status}
                  onChange={(event) => updateGoalStatus(goal.id, event.target.value)}
                >
                  <option value="not started">Not started</option>
                  <option value="in progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            </article>
          ))
        )}
      </LogPanel>
    </div>
  );
}

function DiaryView({ diaryEntries, setDiaryEntries, todayKey, onBack }) {
  const todayEntry = diaryEntries[todayKey] || { mood: 'Focused', note: '' };
  const [form, setForm] = useState(todayEntry);

  useEffect(() => {
    setForm(diaryEntries[todayKey] || { mood: 'Focused', note: '' });
  }, [diaryEntries, todayKey]);

  function handleSubmit(event) {
    event.preventDefault();

    setDiaryEntries((currentEntries) => ({
      ...currentEntries,
      [todayKey]: {
        date: todayKey,
        mood: form.mood,
        note: form.note.trim(),
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  const entries = Object.values(diaryEntries).sort((first, second) =>
    second.date.localeCompare(first.date),
  );

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Mood & Diary"
        title="Mood & Diary"
        subtitle="Write today's note and save it by date."
        onBack={onBack}
      />

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>Today</h2>
        <form onSubmit={handleSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Mood">
              <select
                style={viewStyles.input}
                value={form.mood}
                onChange={(event) => setForm({ ...form, mood: event.target.value })}
              >
                <option>Focused</option>
                <option>Calm</option>
                <option>Happy</option>
                <option>Tired</option>
                <option>Stressed</option>
                <option>Motivated</option>
              </select>
            </Field>
            <Field label="Daily note" fullWidth>
              <textarea
                required
                style={viewStyles.textarea}
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Save diary entry</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Diary entries">
        {entries.length === 0 ? (
          <EmptyState>No diary entries yet.</EmptyState>
        ) : (
          entries.map((entry) => (
            <article key={entry.date} style={viewStyles.logItem}>
              <strong>
                {entry.date} - {entry.mood}
              </strong>
              <span style={viewStyles.logMeta}>{entry.note}</span>
            </article>
          ))
        )}
      </LogPanel>
    </div>
  );
}

function CoachView({ messages, setMessages, onBack }) {
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: createId('message'),
        sender: 'user',
        text: trimmedMessage,
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage('');
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="AI Coach"
        title="AI Coach"
        subtitle="Send messages here. AI replies can be wired in later."
        onBack={onBack}
      />

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>Chat</h2>
        <div style={{ ...viewStyles.logList, marginTop: 0, minHeight: 260 }}>
          {messages.length === 0 ? (
            <EmptyState>No messages yet.</EmptyState>
          ) : (
            messages.map((chatMessage) => (
              <article
                key={chatMessage.id}
                style={{
                  ...viewStyles.logItem,
                  justifySelf: 'end',
                  maxWidth: 620,
                  background: 'rgba(22, 139, 255, 0.16)',
                }}
              >
                <strong>You</strong>
                <span>{chatMessage.text}</span>
                <span style={viewStyles.logMeta}>
                  Sent {formatSavedAt(chatMessage.createdAt)}
                </span>
              </article>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ ...viewStyles.formGrid, marginTop: 18 }}>
            <Field label="Message" fullWidth>
              <input
                required
                style={viewStyles.input}
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Send size={17} aria-hidden="true" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function LogPanel({ title, children }) {
  return (
    <section style={viewStyles.panel}>
      <h2 style={viewStyles.sectionTitle}>{title}</h2>
      <div style={viewStyles.logList}>{children}</div>
    </section>
  );
}

function App() {
  const userName = 'Krishen';
  const todayKey = getLocalDateKey();
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const [activeView, setActiveView] = useState('dashboard');
  const [sleepEntries, setSleepEntries] = useLocalStorageState(STORAGE_KEYS.sleep, []);
  const [workouts, setWorkouts] = useLocalStorageState(STORAGE_KEYS.workouts, []);
  const [meals, setMeals] = useLocalStorageState(STORAGE_KEYS.meals, []);
  const [habits, setHabits] = useLocalStorageState(STORAGE_KEYS.habits, []);
  const [transactions, setTransactions] = useLocalStorageState(STORAGE_KEYS.transactions, []);
  const [goals, setGoals] = useLocalStorageState(STORAGE_KEYS.goals, []);
  const [diaryEntries, setDiaryEntries] = useLocalStorageState(STORAGE_KEYS.diary, {});
  const [coachMessages, setCoachMessages] = useLocalStorageState(STORAGE_KEYS.coach, []);

  const dashboardStats = useMemo(() => {
    const bestHabitStreak = habits.reduce(
      (bestStreak, habit) => Math.max(bestStreak, getHabitStreak(habit, todayKey)),
      0,
    );
    const completedHabitsToday = habits.filter((habit) => habit.completions?.[todayKey]).length;
    const currentMood = diaryEntries[todayKey]?.mood || 'Not logged';

    return [
      { label: 'Streak days', value: String(bestHabitStreak), icon: Flame },
      {
        label: 'Tasks completed today',
        value: `${completedHabitsToday}/${habits.length}`,
        icon: CheckCircle2,
      },
      { label: 'Current mood', value: currentMood, icon: SmilePlus },
    ];
  }, [diaryEntries, habits, todayKey]);

  function openView(view, label) {
    console.log(`LifeOS module clicked: ${label}`);
    setActiveView(view);
  }

  function renderActiveView() {
    switch (activeView) {
      case 'sleep':
        return (
          <SleepView
            entries={sleepEntries}
            setEntries={setSleepEntries}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'gym':
        return (
          <GymView
            workouts={workouts}
            setWorkouts={setWorkouts}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'nutrition':
        return (
          <NutritionView
            meals={meals}
            setMeals={setMeals}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'habits':
        return (
          <HabitsView
            habits={habits}
            setHabits={setHabits}
            todayKey={todayKey}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'finance':
        return (
          <FinanceView
            transactions={transactions}
            setTransactions={setTransactions}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'goals':
        return (
          <GoalsView
            goals={goals}
            setGoals={setGoals}
            todayKey={todayKey}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'diary':
        return (
          <DiaryView
            diaryEntries={diaryEntries}
            setDiaryEntries={setDiaryEntries}
            todayKey={todayKey}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'coach':
        return (
          <CoachView
            messages={coachMessages}
            setMessages={setCoachMessages}
            onBack={() => setActiveView('dashboard')}
          />
        );
      default:
        return (
          <DashboardView
            stats={dashboardStats}
            today={today}
            userName={userName}
            onModuleClick={openView}
          />
        );
    }
  }

  return (
    <div className="lifeos-shell">
      <aside className="sidebar" aria-label="LifeOS navigation">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={22} aria-hidden="true" />
          </div>
          <div>
            <span className="brand-name">LifeOS</span>
            <span className="brand-label">Personal command center</span>
          </div>
        </div>

        <nav className="nav-list">
          {navigationItems.map(({ label, view, icon: Icon }) => (
            <button
              className={`nav-item ${activeView === view ? 'active' : ''}`}
              key={label}
              type="button"
              onClick={() => openView(view, label)}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard">{renderActiveView()}</main>
    </div>
  );
}

export default App;
