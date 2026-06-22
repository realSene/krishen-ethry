import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  BedDouble,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  Code2,
  Database,
  Download,
  Dumbbell,
  Flame,
  HardDrive,
  LayoutDashboard,
  LineChart,
  Moon,
  NotebookPen,
  PiggyBank,
  Plus,
  Save,
  Salad,
  Send,
  Settings,
  SmilePlus,
  Target,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react';
import './App.css';

const STORAGE_KEYS = {
  profile: 'lifeos:userProfile',
  onboardingComplete: 'lifeos:onboardingComplete',
  sidebarCollapsed: 'lifeos:sidebarCollapsed',
  dashboardWidgets: 'lifeos:dashboardWidgets',
  dashboardCharts: 'lifeos:dashboardCharts',
  preferences: 'lifeos:preferences',
  sleep: 'lifeos:sleepEntries',
  workouts: 'lifeos:workouts',
  meals: 'lifeos:meals',
  habits: 'lifeos:habits',
  transactions: 'lifeos:transactions',
  recurringTransactions: 'lifeos:recurringTransactions',
  goals: 'lifeos:goals',
  diary: 'lifeos:diaryEntries',
  coach: 'lifeos:coachMessages',
  developerAccounts: 'lifeos:developerAccounts',
};

const navigationItems = [
  { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
  { label: 'Sleep', view: 'sleep', icon: Moon },
  { label: 'Gym', view: 'gym', icon: Dumbbell },
  { label: 'Nutrition', view: 'nutrition', icon: Salad },
  { label: 'Habits', view: 'habits', icon: CalendarCheck2 },
  { label: 'Finance', view: 'finance', icon: PiggyBank },
  { label: 'Goals', view: 'goals', icon: Target },
  { label: 'Journal', view: 'diary', icon: NotebookPen },
  { label: 'Agenda', view: 'agenda', icon: CalendarCheck2 },
  { label: 'AI Coach', view: 'coach', icon: Bot },
  { label: 'Settings', view: 'settings', icon: Settings },
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

const DEVELOPER_MODE = true;

const defaultPreferences = {
  theme: 'default',
};

const themeOptions = [
  { id: 'default', name: 'Default', description: 'Light blue and green', swatches: ['#86b7c9', '#6f93b8', '#8fbf9f'] },
  { id: 'warm', name: 'Warm', description: 'Orange, red and green', swatches: ['#d8b66a', '#d9909c', '#8fbf9f'] },
  { id: 'cool', name: 'Cool', description: 'Blue and purple', swatches: ['#86b7c9', '#6f93b8', '#aaa1c8'] },
];

const onboardingInitialProfile = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  dateOfBirth: '',
};

const defaultDashboardWidgets = [
  'sleep-overview',
  'habit-streak',
  'finance-balance',
  'agenda-next',
  'goal-progress',
  'weekly-graph',
];

const dashboardWidgetCatalog = [
  {
    id: 'sleep-overview',
    title: 'Sleep tracker',
    type: 'Widget',
    icon: Moon,
    accent: 'cyan',
    value: '7h 42m',
    label: 'Average sleep',
    spark: ['60%', '76%', '68%', '82%', '74%'],
  },
  {
    id: 'habit-streak',
    title: 'Habit streaks',
    type: 'Stat',
    icon: Flame,
    accent: 'rose',
    value: '18 days',
    label: 'Best active streak',
    spark: ['44%', '50%', '62%', '78%', '88%'],
  },
  {
    id: 'finance-balance',
    title: 'Finance balance',
    type: 'Stat',
    icon: PiggyBank,
    accent: 'gold',
    value: '€0',
    label: 'Available this month',
    spark: ['80%', '74%', '69%', '77%', '84%'],
  },
  {
    id: 'agenda-next',
    title: 'Upcoming agenda',
    type: 'Widget',
    icon: CalendarCheck2,
    accent: 'blue',
    value: '3 items',
    label: 'Next 24 hours',
    spark: ['40%', '52%', '72%', '58%', '66%'],
  },
  {
    id: 'goal-progress',
    title: 'Daily goals',
    type: 'Stat',
    icon: Target,
    accent: 'violet',
    value: '68%',
    label: 'Completed today',
    spark: ['28%', '44%', '52%', '60%', '68%'],
  },
  {
    id: 'weekly-graph',
    title: 'Weekly progress',
    type: 'Graph',
    icon: BarChart3,
    accent: 'green',
    value: '+12%',
    label: 'Across key routines',
    spark: ['36%', '58%', '48%', '72%', '88%'],
  },
  {
    id: 'water-intake',
    title: 'Water intake',
    type: 'Widget',
    icon: Activity,
    accent: 'cyan',
    value: '1.8L',
    label: 'Logged today',
    spark: ['20%', '38%', '46%', '62%', '72%'],
  },
  {
    id: 'mood-tracker',
    title: 'Mood tracker',
    type: 'Widget',
    icon: SmilePlus,
    accent: 'violet',
    value: 'Calm',
    label: 'Current mood',
    spark: ['52%', '64%', '56%', '70%', '74%'],
  },
  {
    id: 'workout-summary',
    title: 'Workout summary',
    type: 'Widget',
    icon: Dumbbell,
    accent: 'blue',
    value: 'Upper',
    label: 'Latest session',
    spark: ['46%', '54%', '62%', '52%', '76%'],
  },
];

const dashboardChartCatalog = [
  {
    id: 'sleep-quality-chart',
    title: 'Sleep quality trend',
    type: 'Chart',
    icon: Moon,
    accent: 'cyan',
    label: 'Last sleep entries',
    chart: 'line',
    module: 'sleep',
  },
  {
    id: 'finance-flow-chart',
    title: 'Finance flow',
    type: 'Chart',
    icon: PiggyBank,
    accent: 'gold',
    label: 'Recent balance movement',
    chart: 'bar',
    module: 'finance',
  },
  {
    id: 'workout-volume-chart',
    title: 'Workout volume',
    type: 'Chart',
    icon: Dumbbell,
    accent: 'blue',
    label: 'Recent training load',
    chart: 'bar',
    module: 'gym',
  },
  {
    id: 'nutrition-calorie-chart',
    title: 'Calorie intake',
    type: 'Chart',
    icon: Salad,
    accent: 'green',
    label: 'Recent meals',
    chart: 'line',
    module: 'nutrition',
  },
  {
    id: 'habit-completion-chart',
    title: 'Habit completion',
    type: 'Chart',
    icon: CalendarCheck2,
    accent: 'violet',
    label: 'Last 7 days',
    chart: 'bar',
    module: 'habits',
  },
];

const viewStyles = {
  stack: {
    display: 'grid',
    gap: 18,
  },
  panel: {
    border: '1px solid var(--border)',
    borderRadius: 16,
    background: 'rgba(255, 255, 255, 0.06)',
    boxShadow: 'var(--shadow)',
    backdropFilter: 'blur(12px)',
    padding: 22,
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontFamily: "'DM Sans', 'Inter', sans-serif",
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
    background: 'rgba(255, 255, 255, 0.075)',
    padding: '0 13px',
    outline: 'none',
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
    fontSize: '0.96rem',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  },
  textarea: {
    width: '100%',
    minHeight: 148,
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text)',
    background: 'rgba(255, 255, 255, 0.075)',
    padding: 13,
    outline: 'none',
    resize: 'vertical',
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
    fontSize: '0.96rem',
    lineHeight: 1.5,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
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
    border: '1px solid rgba(216, 182, 106, 0.24)',
    borderRadius: 12,
    color: 'var(--text)',
    background: 'rgba(216, 182, 106, 0.12)',
    cursor: 'pointer',
    boxShadow: 'none',
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    gap: 9,
    padding: '0 16px',
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text)',
    background: 'rgba(255, 255, 255, 0.075)',
    cursor: 'pointer',
    boxShadow: 'none',
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
  },
  dangerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    gap: 9,
    padding: '0 16px',
    border: '1px solid rgba(255, 92, 92, 0.32)',
    borderRadius: 12,
    color: '#ffd9d3',
    background: 'rgba(205, 92, 72, 0.15)',
    cursor: 'pointer',
    boxShadow: 'none',
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
  },
  codeBlock: {
    width: '100%',
    minHeight: 220,
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text)',
    background: 'rgba(16, 20, 24, 0.74)',
    padding: 14,
    outline: 'none',
    resize: 'vertical',
    fontFamily: "'SFMono-Regular', Consolas, monospace",
    fontSize: '0.86rem',
    lineHeight: 1.55,
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
  // Validate date is a valid Date object
  if (!(date instanceof Date) || isNaN(date)) {
    date = new Date();
  }
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

function writeStorageValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorageValue(key) {
  window.localStorage.removeItem(key);
}

function getStoredValueSize(value) {
  return new Blob([value || '']).size;
}

function getLocalStorageStatus() {
  const entries = Object.keys(window.localStorage).map((key) => ({
    key,
    size: getStoredValueSize(window.localStorage.getItem(key)),
  }));
  const lifeOsEntries = entries.filter((entry) => entry.key.startsWith('lifeos:'));
  const totalBytes = lifeOsEntries.reduce((total, entry) => total + entry.size, 0);

  return {
    entries: lifeOsEntries,
    entryCount: lifeOsEntries.length,
    totalBytes,
    totalKb: (totalBytes / 1024).toFixed(2),
  };
}

function getStorageSnapshot() {
  return Object.entries(STORAGE_KEYS).reduce((snapshot, [name, key]) => {
    snapshot[name] = readStorageValue(key, null);
    return snapshot;
  }, {});
}

function getModuleEntryCount(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') return Object.keys(value).length;
  if (value) return 1;
  return 0;
}

function getMonthKey(value = new Date()) {
  return getLocalDateKey(value).slice(0, 7);
}

function isRecurringActiveThisMonth(item, monthKey = getMonthKey()) {
  if (!item.active) return false;
  const startMonth = item.startMonth || monthKey;
  const endMonth = item.endMonth || '';
  return startMonth <= monthKey && (!endMonth || endMonth >= monthKey);
}

function getRecurringMonthlyTotal(items, monthKey = getMonthKey()) {
  if (!items || !Array.isArray(items)) return 0;
  return items.filter((item) => isRecurringActiveThisMonth(item, monthKey)).reduce((total, item) => {
    const amount = Number(item.amount) || 0;
    return item.type === 'income' ? total + amount : total - amount;
  }, 0);
}

function getRecentItems(items, limit = 7) {
  if (!items || !Array.isArray(items)) return [];
  return [...items]
    .sort((first, second) => new Date(first.createdAt || 0) - new Date(second.createdAt || 0))
    .slice(-limit);
}

function buildDashboardChartData(chartId, data) {
  if (chartId === 'sleep-quality-chart') {
    const values = getRecentItems(data.sleepEntries).map((entry, index) => ({
      label: `Sleep ${index + 1}`,
      value: Number(entry.quality) || 0,
    }));
    return values.length ? values : [{ label: 'No data', value: 0 }];
  }

  if (chartId === 'finance-flow-chart') {
    const values = getRecentItems(data.transactions).map((transaction) => ({
      label: transaction.category || transaction.type,
      value: transaction.type === 'income' ? transaction.amount : -transaction.amount,
    }));
    const recurringTotal = getRecurringMonthlyTotal(data.recurringTransactions);
    return [...values, ...(recurringTotal ? [{ label: 'Monthly', value: recurringTotal }] : [])].slice(-7);
  }

  if (chartId === 'workout-volume-chart') {
    const values = getRecentItems(data.workouts).map((workout) => ({
      label: workout.exercise || 'Workout',
      value: (Number(workout.sets) || 0) * (Number(workout.reps) || 0) * (Number(workout.weight) || 0),
    }));
    return values.length ? values : [{ label: 'No data', value: 0 }];
  }

  if (chartId === 'nutrition-calorie-chart') {
    const values = getRecentItems(data.meals).map((meal) => ({
      label: meal.name || 'Meal',
      value: Number(meal.calories) || 0,
    }));
    return values.length ? values : [{ label: 'No data', value: 0 }];
  }

  if (chartId === 'habit-completion-chart') {
    const habits = data.habits || [];
    // Validate todayKey is a valid date string
    const todayKey = data.todayKey || getLocalDateKey();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(`${todayKey}T00:00:00`);
      // Validate the date was created successfully
      if (isNaN(date)) {
        return {
          label: 'Invalid',
          value: 0,
        };
      }
      date.setDate(date.getDate() - (6 - index));
      const dateKey = getLocalDateKey(date);
      return {
        label: dateKey.slice(5),
        value: habits.filter((habit) => habit.completions?.[dateKey]).length,
      };
    });
  }

  return [];
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return '';

  const today = new Date();
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return Number.isFinite(age) ? age : '';
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

function DashboardChart({ chart, data }) {
  const values = data.map((item) => Number(item.value) || 0);
  const maxValue = Math.max(...values.map((value) => Math.abs(value)), 1);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 86 - ((value + maxValue) / (maxValue * 2)) * 72;
    return `${x},${Math.max(12, Math.min(86, y))}`;
  });

  if (chart === 'line') {
    return (
      <svg className="dashboard-chart" role="img" aria-label="Line chart" viewBox="0 0 100 100">
        <path className="chart-grid-line" d="M0 50 H100" />
        <polyline className="chart-line" points={points.join(' ')} />
        {points.map((point, index) => {
          const [x, y] = point.split(',');
          return <circle className="chart-point" cx={x} cy={y} key={`${point}-${index}`} r="2.7" />;
        })}
      </svg>
    );
  }

  return (
    <svg className="dashboard-chart" role="img" aria-label="Bar chart" viewBox="0 0 100 100">
      <path className="chart-grid-line" d="M0 50 H100" />
      {values.map((value, index) => {
        const width = 100 / Math.max(values.length, 1) - 4;
        const x = index * (100 / Math.max(values.length, 1)) + 2;
        const height = Math.max(5, (Math.abs(value) / maxValue) * 38);
        const y = value >= 0 ? 50 - height : 50;

        return (
          <rect
            className={value >= 0 ? 'chart-bar positive' : 'chart-bar negative'}
            height={height}
            key={`${value}-${index}`}
            rx="2"
            width={Math.max(width, 5)}
            x={x}
            y={y}
          />
        );
      })}
    </svg>
  );
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

function DashboardView({
  userName,
  today,
  stats,
  sleepEntries,
  workouts,
  meals,
  habits,
  transactions,
  recurringTransactions,
  todayKey,
}) {
  const [editMode, setEditMode] = useState(false);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [draggedWidgetId, setDraggedWidgetId] = useState(null);
  const [dashboardWidgetIds, setDashboardWidgetIds] = useLocalStorageState(
    STORAGE_KEYS.dashboardWidgets,
    defaultDashboardWidgets,
  );
  const [dashboardChartIds, setDashboardChartIds] = useLocalStorageState(
    STORAGE_KEYS.dashboardCharts,
    ['sleep-quality-chart', 'finance-flow-chart'],
  );

  const catalogById = useMemo(
    () => Object.fromEntries(dashboardWidgetCatalog.map((widget) => [widget.id, widget])),
    [],
  );
  const chartCatalogById = useMemo(
    () => Object.fromEntries(dashboardChartCatalog.map((chart) => [chart.id, chart])),
    [],
  );
  const visibleWidgets = dashboardWidgetIds.map((widgetId) => catalogById[widgetId]).filter(Boolean);
  const visibleCharts = dashboardChartIds.map((chartId) => chartCatalogById[chartId]).filter(Boolean);
  const visibleDashboardItems = [
    ...visibleWidgets.map((widget) => ({ ...widget, itemType: 'widget' })),
    ...visibleCharts.map((chart) => ({ ...chart, itemType: 'chart' })),
  ];
  const hiddenWidgets = dashboardWidgetCatalog.filter((widget) => !dashboardWidgetIds.includes(widget.id));
  const hiddenCharts = dashboardChartCatalog.filter((chart) => !dashboardChartIds.includes(chart.id));
  const dashboardStatsByLabel = Object.fromEntries(stats.map((stat) => [stat.label, stat.value]));
  const chartDataById = useMemo(
    () =>
      Object.fromEntries(
        dashboardChartCatalog.map((chart) => [
          chart.id,
          buildDashboardChartData(chart.id, {
            sleepEntries,
            workouts,
            meals,
            habits,
            transactions,
            recurringTransactions,
            todayKey,
          }),
        ]),
      ),
    [habits, meals, recurringTransactions, sleepEntries, todayKey, transactions, workouts],
  );

  function moveWidget(targetWidgetId) {
    if (!draggedWidgetId || draggedWidgetId === targetWidgetId) return;

    setDashboardWidgetIds((currentWidgetIds) => {
      const draggedIndex = currentWidgetIds.indexOf(draggedWidgetId);
      const targetIndex = currentWidgetIds.indexOf(targetWidgetId);

      if (draggedIndex === -1 || targetIndex === -1) return currentWidgetIds;

      const nextWidgetIds = [...currentWidgetIds];
      nextWidgetIds.splice(draggedIndex, 1);
      nextWidgetIds.splice(targetIndex, 0, draggedWidgetId);
      return nextWidgetIds;
    });
  }

  function removeDashboardItem(itemId, itemType) {
    if (itemType === 'chart') {
      setDashboardChartIds((currentChartIds) =>
        currentChartIds.filter((currentChartId) => currentChartId !== itemId),
      );
      return;
    }

    setDashboardWidgetIds((currentWidgetIds) =>
      currentWidgetIds.filter((currentWidgetId) => currentWidgetId !== itemId),
    );
  }

  function addDashboardItem(itemId, itemType) {
    if (itemType === 'chart') {
      setDashboardChartIds((currentChartIds) => [...currentChartIds, itemId]);
    } else {
      setDashboardWidgetIds((currentWidgetIds) => [...currentWidgetIds, itemId]);
    }

    setAddPanelOpen(false);
  }

  function resetDashboardWidgets() {
    setDashboardWidgetIds(defaultDashboardWidgets);
    setDashboardChartIds(['sleep-quality-chart', 'finance-flow-chart']);
    setAddPanelOpen(false);
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Main dashboard</p>
          <h1>Welcome back, {userName}</h1>
          <p className="date-line">{today}</p>
        </div>
        <div className="dashboard-actions">
          <button
            className="insight-button"
            type="button"
            onClick={() => setEditMode((currentValue) => !currentValue)}
          >
            <BarChart3 size={18} aria-hidden="true" />
            <span>{editMode ? 'Done editing' : 'Edit dashboard'}</span>
          </button>
          {editMode && (
            <button
              className="insight-button secondary"
              type="button"
              onClick={() => setAddPanelOpen((currentValue) => !currentValue)}
            >
              <Plus size={18} aria-hidden="true" />
              <span>Add widget or chart</span>
            </button>
          )}
        </div>
      </header>

      {editMode && addPanelOpen && (
        <section className="widget-add-panel" aria-label="Available dashboard widgets">
          <div>
            <h2>Choose dashboard blocks</h2>
            <p>Add quick stats or real charts. Your layout is saved locally on this laptop.</p>
          </div>
          <div className="widget-add-grid">
            {hiddenWidgets.length === 0 && hiddenCharts.length === 0 && (
              <span className="empty-add-state">Everything is already on the dashboard.</span>
            )}
            {hiddenWidgets.map(({ id, title, type, icon: Icon }) => (
              <button key={id} type="button" onClick={() => addDashboardItem(id, 'widget')}>
                <Icon size={18} aria-hidden="true" />
                <span>{title}</span>
                <small>{type}</small>
              </button>
            ))}
            {hiddenCharts.map(({ id, title, type, icon: Icon }) => (
              <button key={id} type="button" onClick={() => addDashboardItem(id, 'chart')}>
                <Icon size={18} aria-hidden="true" />
                <span>{title}</span>
                <small>{type}</small>
              </button>
            ))}
          </div>
          <button className="reset-dashboard-button" type="button" onClick={resetDashboardWidgets}>
            Reset dashboard layout
          </button>
        </section>
      )}

      <section className={`module-grid widget-dashboard-grid ${editMode ? 'editing' : ''}`} aria-label="Custom dashboard widgets">
        {visibleDashboardItems.map(({ id, title, type, icon: Icon, accent, value, label, spark, chart, itemType }) => {
          const dynamicValue = dashboardStatsByLabel[label] || value;
          const chartData = chartDataById[id] || [];

          return (
            <article
              className={`module-card dashboard-widget ${itemType === 'chart' ? 'dashboard-chart-card' : ''} accent-${accent}`}
              draggable={editMode && itemType === 'widget'}
              key={id}
              onDragStart={() => setDraggedWidgetId(id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => moveWidget(id)}
            >
              {editMode && (
                <button
                  className="widget-remove-button"
                  type="button"
                  aria-label={`Remove ${title}`}
                  onClick={() => removeDashboardItem(id, itemType)}
                >
                  x
                </button>
              )}
              <span className="module-icon">
                <Icon size={26} aria-hidden="true" />
              </span>
              <span className="widget-type">{type}</span>
              <span className="module-copy">
                <span className="module-title">{title}</span>
                {itemType === 'chart' ? (
                  <DashboardChart chart={chart} data={chartData} />
                ) : (
                  <strong className="widget-value">{dynamicValue}</strong>
                )}
                <span className="widget-label">{label}</span>
              </span>
              {itemType !== 'chart' && (
                <span className="mini-chart" aria-hidden="true">
                  {spark.map((height, index) => (
                    <span key={`${id}-${index}`} style={{ height }} />
                  ))}
                </span>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}
function OnboardingFlow({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState(onboardingInitialProfile);
  const [error, setError] = useState('');
  const totalSteps = 7;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  function updateProfile(field, value) {
    setProfile((currentProfile) => ({ ...currentProfile, [field]: value }));
    setError('');
  }

  function getStepError() {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim());

    if (stepIndex === 1 && !profile.firstName.trim()) return 'Vul je voornaam in.';
    if (stepIndex === 2 && !profile.lastName.trim()) return 'Vul je achternaam in.';
    if (stepIndex === 3 && !validEmail) return 'Vul een geldig e-mailadres in.';
    if (stepIndex === 4 && !profile.gender) return 'Kies je gender.';
    if (stepIndex === 5 && !profile.dateOfBirth) return 'Kies je geboortedatum.';
    return '';
  }

  function goNext() {
    const stepError = getStepError();

    if (stepError) {
      setError(stepError);
      return;
    }

    setStepIndex((currentStepIndex) => Math.min(currentStepIndex + 1, totalSteps - 1));
  }

  function goBack() {
    setError('');
    setStepIndex((currentStepIndex) => Math.max(currentStepIndex - 1, 0));
  }

  function completeOnboarding() {
    const completedProfile = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email.trim(),
      age: calculateAge(profile.dateOfBirth),
      createdAt: new Date().toISOString(),
    };

    writeStorageValue(STORAGE_KEYS.profile, completedProfile);
    writeStorageValue(STORAGE_KEYS.onboardingComplete, true);
    writeStorageValue(STORAGE_KEYS.preferences, defaultPreferences);
    onComplete(completedProfile);
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-progress" aria-label={`Step ${stepIndex + 1} of ${totalSteps}`}>
        <div>
          <span>Account setup</span>
          <span>{stepIndex + 1}/{totalSteps}</span>
        </div>
        <span className="onboarding-progress-track">
          <span style={{ width: `${progress}%` }} />
        </span>
      </section>

      <section className="onboarding-card" key={stepIndex}>
        {stepIndex === 0 && (
          <>
            <div className="onboarding-logo">
              <Activity size={24} aria-hidden="true" />
              <span>LifeOS</span>
            </div>
            <h1>Your life, organized beautifully.</h1>
            <p>Maak een lokaal account aan en start met je persoonlijke dashboard.</p>
            <button className="insight-button" type="button" onClick={goNext}>
              Get started
            </button>
          </>
        )}

        {stepIndex === 1 && (
          <OnboardingQuestion
            title="What is your first name?"
            value={profile.firstName}
            placeholder="Krishen"
            onBack={goBack}
            onChange={(value) => updateProfile('firstName', value)}
            onNext={goNext}
            error={error}
          />
        )}

        {stepIndex === 2 && (
          <OnboardingQuestion
            title="What is your last name?"
            value={profile.lastName}
            placeholder="Patel"
            onBack={goBack}
            onChange={(value) => updateProfile('lastName', value)}
            onNext={goNext}
            error={error}
          />
        )}

        {stepIndex === 3 && (
          <OnboardingQuestion
            title="What is your email address?"
            type="email"
            value={profile.email}
            placeholder="you@lifeos.local"
            onBack={goBack}
            onChange={(value) => updateProfile('email', value)}
            onNext={goNext}
            error={error}
          />
        )}

        {stepIndex === 4 && (
          <>
            <p className="eyebrow">Profile</p>
            <h1>What is your gender?</h1>
            <div className="gender-grid">
              {[
                ['male', 'Male', 'ðŸ§‘â€ðŸš€'],
                ['female', 'Female', 'ðŸ‘©â€ðŸš€'],
              ].map(([value, label, emoji]) => (
                <button
                  className={`gender-card ${profile.gender === value ? 'selected' : ''}`}
                  key={value}
                  type="button"
                  onClick={() => updateProfile('gender', value)}
                >
                  <span>{emoji}</span>
                  <strong>{label}</strong>
                </button>
              ))}
            </div>
            {error && <p className="form-error">{error}</p>}
            <OnboardingActions onBack={goBack} onNext={goNext} />
          </>
        )}

        {stepIndex === 5 && (
          <>
            <p className="eyebrow">Profile</p>
            <h1>What is your date of birth?</h1>
            <input
              className="onboarding-input"
              type="date"
              value={profile.dateOfBirth}
              max={getLocalDateKey()}
              onChange={(event) => updateProfile('dateOfBirth', event.target.value)}
            />
            {profile.dateOfBirth && (
              <p className="onboarding-hint">LifeOS calculates your age as {calculateAge(profile.dateOfBirth)}.</p>
            )}
            {error && <p className="form-error">{error}</p>}
            <OnboardingActions onBack={goBack} onNext={goNext} />
          </>
        )}

        {stepIndex === 6 && (
          <>
            <div className="onboarding-logo">
              <Activity size={24} aria-hidden="true" />
              <span>LifeOS</span>
            </div>
            <h1>Welcome to LifeOS, {profile.firstName || 'friend'}.</h1>
            <p>Je lokale account is klaar. Alles wat je nu instelt blijft op deze laptop bewaard.</p>
            <button className="insight-button" type="button" onClick={completeOnboarding}>
              Go to my dashboard
            </button>
          </>
        )}
      </section>
    </main>
  );
}

function OnboardingQuestion({
  title,
  value,
  onChange,
  onNext,
  onBack,
  placeholder,
  type = 'text',
  error,
}) {
  return (
    <>
      <p className="eyebrow">Profile</p>
      <h1>{title}</h1>
      <input
        autoFocus
        className="onboarding-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onNext();
        }}
      />
      {error && <p className="form-error">{error}</p>}
      <OnboardingActions onBack={onBack} onNext={onNext} />
    </>
  );
}

function OnboardingActions({ onBack, onNext }) {
  return (
    <div className="onboarding-actions">
      <button className="insight-button secondary" type="button" onClick={onBack}>
        Back
      </button>
      <button className="insight-button" type="button" onClick={onNext}>
        Next
      </button>
    </div>
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

function FinanceView({ transactions, setTransactions, recurringTransactions, setRecurringTransactions, onBack }) {
  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
  });
  const [recurringForm, setRecurringForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    dayOfMonth: '1',
    startMonth: getMonthKey(),
    endMonth: '',
  });

  const transactionBalance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
  const recurringMonthlyTotal = getRecurringMonthlyTotal(recurringTransactions);
  const balance = transactionBalance + recurringMonthlyTotal;
  const activeRecurringItems = recurringTransactions.filter((item) => isRecurringActiveThisMonth(item));

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

  function handleRecurringSubmit(event) {
    event.preventDefault();

    const recurringTransaction = {
      id: createId('recurring'),
      type: recurringForm.type,
      amount: Number(recurringForm.amount),
      category: recurringForm.category.trim(),
      description: recurringForm.description.trim(),
      dayOfMonth: Number(recurringForm.dayOfMonth),
      startMonth: recurringForm.startMonth,
      endMonth: recurringForm.endMonth,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setRecurringTransactions((currentItems) => [recurringTransaction, ...currentItems]);
    setRecurringForm({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      dayOfMonth: '1',
      startMonth: getMonthKey(),
      endMonth: '',
    });
  }

  function toggleRecurringItem(itemId) {
    setRecurringTransactions((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, active: !item.active } : item)),
    );
  }

  function deleteRecurringItem(itemId) {
    setRecurringTransactions((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }

  return (
    <div style={viewStyles.stack}>
      <ModuleHeader
        eyebrow="Finance"
        title="Finance"
        subtitle="Track income, expenses, recurring monthly items, and current balance."
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
        <div className="stat-pill">
          <span className="stat-icon">
            <LineChart size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{currencyFormatter.format(recurringMonthlyTotal)}</strong>
            <small>Monthly recurring impact</small>
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-icon">
            <CalendarCheck2 size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{activeRecurringItems.length}</strong>
            <small>Active monthly items</small>
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

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>Monthly recurring</h2>
        <form onSubmit={handleRecurringSubmit}>
          <div style={viewStyles.formGrid}>
            <Field label="Type">
              <select
                style={viewStyles.input}
                value={recurringForm.type}
                onChange={(event) => setRecurringForm({ ...recurringForm, type: event.target.value })}
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
                value={recurringForm.amount}
                onChange={(event) => setRecurringForm({ ...recurringForm, amount: event.target.value })}
              />
            </Field>
            <Field label="Category">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={recurringForm.category}
                onChange={(event) => setRecurringForm({ ...recurringForm, category: event.target.value })}
              />
            </Field>
            <Field label="Description">
              <input
                required
                style={viewStyles.input}
                type="text"
                value={recurringForm.description}
                onChange={(event) => setRecurringForm({ ...recurringForm, description: event.target.value })}
              />
            </Field>
            <Field label="Day of month">
              <input
                required
                max="31"
                min="1"
                style={viewStyles.input}
                type="number"
                value={recurringForm.dayOfMonth}
                onChange={(event) => setRecurringForm({ ...recurringForm, dayOfMonth: event.target.value })}
              />
            </Field>
            <Field label="Start month">
              <input
                required
                style={viewStyles.input}
                type="month"
                value={recurringForm.startMonth}
                onChange={(event) => setRecurringForm({ ...recurringForm, startMonth: event.target.value })}
              />
            </Field>
            <Field label="End month">
              <input
                style={viewStyles.input}
                type="month"
                value={recurringForm.endMonth}
                onChange={(event) => setRecurringForm({ ...recurringForm, endMonth: event.target.value })}
              />
            </Field>
          </div>
          <div style={viewStyles.buttonRow}>
            <button style={viewStyles.primaryButton} type="submit">
              <Plus size={17} aria-hidden="true" />
              <span>Add monthly item</span>
            </button>
          </div>
        </form>
      </section>

      <LogPanel title="Monthly recurring items">
        {recurringTransactions.length === 0 ? (
          <EmptyState>No monthly items yet.</EmptyState>
        ) : (
          recurringTransactions.map((item) => (
            <article key={item.id} style={viewStyles.logItem}>
              <div style={viewStyles.inlineActions}>
                <strong>
                  {item.type === 'income' ? '+' : '-'}
                  {currencyFormatter.format(item.amount)} - {item.category}
                </strong>
                <button style={viewStyles.secondaryButton} type="button" onClick={() => toggleRecurringItem(item.id)}>
                  {item.active ? 'Pause' : 'Resume'}
                </button>
                <button style={viewStyles.dangerButton} type="button" onClick={() => deleteRecurringItem(item.id)}>
                  <Trash2 size={16} aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </div>
              <span style={viewStyles.logMeta}>{item.description}</span>
              <span style={viewStyles.logMeta}>
                Day {item.dayOfMonth} each month from {item.startMonth}
                {item.endMonth ? ` until ${item.endMonth}` : ''} - {item.active ? 'active' : 'paused'}
              </span>
            </article>
          ))
        )}
      </LogPanel>

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

function SettingsView({
  profile,
  setProfile,
  preferences,
  setPreferences,
  theme,
  setTheme,
  developerAccounts,
  setDeveloperAccounts,
  onBack,
  onDeleteAccount,
  onDeleteStorageKey,
  onImportStorageSnapshot,
}) {
  const [developerClickCount, setDeveloperClickCount] = useState(0);
  const [developerPanelOpen, setDeveloperPanelOpen] = useState(false);
  const [storageStatus, setStorageStatus] = useState(() => getLocalStorageStatus());
  const [storageSnapshot, setStorageSnapshot] = useState(() => getStorageSnapshot());
  const [selectedAccountId, setSelectedAccountId] = useState('primary');
  const [accountEditorValue, setAccountEditorValue] = useState('');
  const [storageEditorValue, setStorageEditorValue] = useState('');
  const [developerMessage, setDeveloperMessage] = useState('');

  const allAccounts = useMemo(
    () => [
      {
        id: 'primary',
        label: `${profile?.firstName || 'Primary'} ${profile?.lastName || 'account'}`.trim(),
        type: 'Current user',
        data: { profile, preferences },
      },
      ...developerAccounts.map((account) => ({
        id: account.id,
        label: `${account.profile?.firstName || 'Test'} ${account.profile?.lastName || 'account'}`.trim(),
        type: 'Development account',
        data: account,
      })),
    ],
    [developerAccounts, preferences, profile],
  );

  useEffect(() => {
    const selectedAccount = allAccounts.find((account) => account.id === selectedAccountId) || allAccounts[0];
    setAccountEditorValue(JSON.stringify(selectedAccount?.data || {}, null, 2));
  }, [allAccounts, selectedAccountId]);

  useEffect(() => {
    setStorageEditorValue(JSON.stringify(storageSnapshot, null, 2));
  }, [storageSnapshot]);

  function refreshDeveloperData(message = '') {
    setStorageStatus(getLocalStorageStatus());
    setStorageSnapshot(getStorageSnapshot());
    setDeveloperMessage(message);
  }

  function updateProfileField(field, value) {
    const nextProfile = {
      ...(profile || {}),
      [field]: value,
      updatedAt: new Date().toISOString(),
    };

    if (field === 'dateOfBirth') {
      nextProfile.age = calculateAge(value);
    }

    setProfile(nextProfile);
    writeStorageValue(STORAGE_KEYS.profile, nextProfile);
    setStorageStatus(getLocalStorageStatus());
  }

  function updateTheme(nextTheme) {
    const nextPreferences = { ...preferences, theme: nextTheme };
    setTheme(nextTheme);
    setPreferences(nextPreferences);
    writeStorageValue(STORAGE_KEYS.preferences, nextPreferences);
  }

  function handleDeveloperLogoClick() {
    if (!DEVELOPER_MODE) return;

    const nextClickCount = developerClickCount + 1;
    setDeveloperClickCount(nextClickCount);

    if (nextClickCount >= 3) {
      console.log('dev mode toggle');
      setDeveloperPanelOpen((currentValue) => !currentValue);
      setDeveloperClickCount(0);
      refreshDeveloperData('Developer Mode toggled.');
    }
  }

  function addTestAccount() {
    const testAccount = {
      id: createId('dev-account'),
      profile: {
        firstName: 'Test',
        lastName: `User ${developerAccounts.length + 1}`,
        email: `test${developerAccounts.length + 1}@lifeos.local`,
        dateOfBirth: '1995-01-01',
        age: calculateAge('1995-01-01'),
        createdAt: new Date().toISOString(),
      },
      preferences: {
        accountType: 'development',
        storage: 'localStorage',
        savedOnDevice: true,
      },
      data: getStorageSnapshot(),
    };

    const nextAccounts = [testAccount, ...developerAccounts];
    setDeveloperAccounts(nextAccounts);
    writeStorageValue(STORAGE_KEYS.developerAccounts, nextAccounts);
    setSelectedAccountId(testAccount.id);
    refreshDeveloperData('Test account added.');
  }

  function saveSelectedAccount() {
    try {
      const parsedAccount = JSON.parse(accountEditorValue);

      if (selectedAccountId === 'primary') {
        const nextProfile = parsedAccount.profile || parsedAccount;
        const nextPreferences = parsedAccount.preferences || preferences;
        setProfile(nextProfile);
        setPreferences(nextPreferences);
        writeStorageValue(STORAGE_KEYS.profile, nextProfile);
        writeStorageValue(STORAGE_KEYS.preferences, nextPreferences);
      } else {
        const nextAccounts = developerAccounts.map((account) =>
          account.id === selectedAccountId ? { ...parsedAccount, id: selectedAccountId } : account,
        );
        setDeveloperAccounts(nextAccounts);
        writeStorageValue(STORAGE_KEYS.developerAccounts, nextAccounts);
      }

      refreshDeveloperData('Account data saved.');
    } catch {
      setDeveloperMessage('Account JSON is not valid.');
    }
  }

  function deleteSelectedAccount() {
    if (selectedAccountId === 'primary') {
      onDeleteAccount();
      return;
    }

    const nextAccounts = developerAccounts.filter((account) => account.id !== selectedAccountId);
    setDeveloperAccounts(nextAccounts);
    writeStorageValue(STORAGE_KEYS.developerAccounts, nextAccounts);
    setSelectedAccountId('primary');
    refreshDeveloperData('Development account removed.');
  }

  function deleteStorageEntry(keyName) {
    onDeleteStorageKey(keyName);
    refreshDeveloperData(`${keyName} removed.`);
  }

  function exportStorageData() {
    const blob = new Blob([JSON.stringify(getStorageSnapshot(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifeos-export-${getLocalDateKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    refreshDeveloperData('Storage export created.');
  }

  function importStorageData(event) {
    const [file] = event.target.files || [];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedSnapshot = JSON.parse(reader.result);
        onImportStorageSnapshot(importedSnapshot);
        refreshDeveloperData('Storage import completed.');
      } catch {
        setDeveloperMessage('Import file is not valid JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function applyStorageEditor() {
    try {
      const parsedSnapshot = JSON.parse(storageEditorValue);
      onImportStorageSnapshot(parsedSnapshot);
      refreshDeveloperData('Storage JSON applied.');
    } catch {
      setDeveloperMessage('Storage JSON is not valid.');
    }
  }

  const moduleCounts = Object.entries(storageSnapshot).filter(([name]) =>
    ['sleep', 'workouts', 'meals', 'habits', 'transactions', 'goals', 'diary', 'coach'].includes(name),
  );

  return (
    <div style={viewStyles.stack}>
      <header className="dashboard-header">
        <div>
          <button
            aria-label="LifeOS Settings developer toggle"
            onClick={handleDeveloperLogoClick}
            style={{ ...viewStyles.secondaryButton, marginBottom: 14 }}
            type="button"
          >
            <Activity size={18} aria-hidden="true" />
            <span>LifeOS</span>
          </button>
          <p className="eyebrow">User settings</p>
          <h1>Settings</h1>
          <p className="date-line">Manage your local profile, storage and account data.</p>
        </div>
        <button className="insight-button" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back</span>
        </button>
      </header>

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>Profile information</h2>
        <div style={viewStyles.formGrid}>
          <Field label="First name">
            <input
              style={viewStyles.input}
              type="text"
              value={profile?.firstName || ''}
              onChange={(event) => updateProfileField('firstName', event.target.value)}
            />
          </Field>
          <Field label="Last name">
            <input
              style={viewStyles.input}
              type="text"
              value={profile?.lastName || ''}
              onChange={(event) => updateProfileField('lastName', event.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              style={viewStyles.input}
              type="email"
              value={profile?.email || ''}
              onChange={(event) => updateProfileField('email', event.target.value)}
            />
          </Field>
          <Field label="Date of birth">
            <input
              style={viewStyles.input}
              type="date"
              value={profile?.dateOfBirth || ''}
              onChange={(event) => updateProfileField('dateOfBirth', event.target.value)}
            />
          </Field>
        </div>
      </section>

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>App theme</h2>
        <div className="theme-picker" role="radiogroup" aria-label="App theme">
          {themeOptions.map((option) => (
            <button
              className={`theme-option ${theme === option.id ? 'selected' : ''}`}
              key={option.id}
              type="button"
              role="radio"
              aria-checked={theme === option.id}
              onClick={() => updateTheme(option.id)}
            >
              <span className="theme-swatches" aria-hidden="true">
                {option.swatches.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </span>
              <strong>{option.name}</strong>
              <small>{option.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="stats-bar" aria-label="Storage status">
        <div className="stat-pill">
          <span className="stat-icon">
            <HardDrive size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{storageStatus.totalKb} KB</strong>
            <small>LifeOS localStorage</small>
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-icon">
            <Database size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{storageStatus.entryCount}</strong>
            <small>Stored entries</small>
          </span>
        </div>
      </section>

      <section style={viewStyles.panel}>
        <h2 style={viewStyles.sectionTitle}>Account</h2>
        <p style={viewStyles.logMeta}>
          Deleting your account removes the local profile and connected LifeOS data from this browser.
        </p>
        <div style={viewStyles.buttonRow}>
          <button style={viewStyles.dangerButton} type="button" onClick={onDeleteAccount}>
            <Trash2 size={17} aria-hidden="true" />
            <span>Delete account</span>
          </button>
        </div>
      </section>

      {DEVELOPER_MODE && developerPanelOpen && (
        <section style={viewStyles.panel}>
          <div style={viewStyles.inlineActions}>
            <Code2 size={20} aria-hidden="true" />
            <h2 style={{ ...viewStyles.sectionTitle, margin: 0 }}>Developer Mode</h2>
          </div>
          {developerMessage && <p style={{ ...viewStyles.logMeta, marginTop: 10 }}>{developerMessage}</p>}

          <div style={{ ...viewStyles.logList, marginTop: 18 }}>
            <article style={viewStyles.logItem}>
              <h3 style={viewStyles.sectionTitle}>Account Management</h3>
              <div style={viewStyles.formGrid}>
                <Field label="Account">
                  <select
                    style={viewStyles.input}
                    value={selectedAccountId}
                    onChange={(event) => setSelectedAccountId(event.target.value)}
                  >
                    {allAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.label} - {account.type}
                      </option>
                    ))}
                  </select>
                </Field>
                <div style={{ ...viewStyles.inlineActions, alignSelf: 'end' }}>
                  <button style={viewStyles.secondaryButton} type="button" onClick={addTestAccount}>
                    <Plus size={17} aria-hidden="true" />
                    <span>Add test account</span>
                  </button>
                  <button style={viewStyles.primaryButton} type="button" onClick={saveSelectedAccount}>
                    <Save size={17} aria-hidden="true" />
                    <span>Save account data</span>
                  </button>
                  <button style={viewStyles.dangerButton} type="button" onClick={deleteSelectedAccount}>
                    <Trash2 size={17} aria-hidden="true" />
                    <span>Delete account data</span>
                  </button>
                </div>
                <Field label="Account JSON" fullWidth>
                  <textarea
                    style={viewStyles.codeBlock}
                    value={accountEditorValue}
                    onChange={(event) => setAccountEditorValue(event.target.value)}
                  />
                </Field>
              </div>
            </article>

            <article style={viewStyles.logItem}>
              <h3 style={viewStyles.sectionTitle}>Data Management</h3>
              <div style={viewStyles.buttonRow}>
                <button style={viewStyles.secondaryButton} type="button" onClick={exportStorageData}>
                  <Download size={17} aria-hidden="true" />
                  <span>Export JSON</span>
                </button>
                <label style={viewStyles.secondaryButton}>
                  <Upload size={17} aria-hidden="true" />
                  <span>Import JSON</span>
                  <input accept="application/json" hidden type="file" onChange={importStorageData} />
                </label>
                <button style={viewStyles.primaryButton} type="button" onClick={applyStorageEditor}>
                  <Save size={17} aria-hidden="true" />
                  <span>Apply JSON</span>
                </button>
              </div>
              <div style={{ ...viewStyles.logList, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {Object.entries(STORAGE_KEYS).map(([name, key]) => (
                  <article key={key} style={viewStyles.logItem}>
                    <strong>{name}</strong>
                    <span style={viewStyles.logMeta}>{key}</span>
                    <button style={viewStyles.dangerButton} type="button" onClick={() => deleteStorageEntry(name)}>
                      <Trash2 size={16} aria-hidden="true" />
                      <span>Delete entry</span>
                    </button>
                  </article>
                ))}
              </div>
              <Field label="All STORAGE_KEYS data" fullWidth>
                <textarea
                  style={viewStyles.codeBlock}
                  value={storageEditorValue}
                  onChange={(event) => setStorageEditorValue(event.target.value)}
                />
              </Field>
            </article>

            <article style={viewStyles.logItem}>
              <h3 style={viewStyles.sectionTitle}>Debug Info</h3>
              <div className="stats-bar" aria-label="Developer debug stats">
                <div className="stat-pill">
                  <span className="stat-icon">
                    <HardDrive size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{storageStatus.totalKb} KB</strong>
                    <small>Storage size</small>
                  </span>
                </div>
                <div className="stat-pill">
                  <span className="stat-icon">
                    <Database size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{storageStatus.entryCount}</strong>
                    <small>LifeOS keys</small>
                  </span>
                </div>
                <div className="stat-pill">
                  <span className="stat-icon">
                    <UserRound size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{allAccounts.length}</strong>
                    <small>Account records</small>
                  </span>
                </div>
              </div>
              <div style={{ ...viewStyles.logList, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {moduleCounts.map(([name, value]) => (
                  <article key={name} style={viewStyles.logItem}>
                    <strong>{name}</strong>
                    <span style={viewStyles.logMeta}>{getModuleEntryCount(value)} entries</span>
                  </article>
                ))}
              </div>
              <p style={viewStyles.logMeta}>Last snapshot refresh: {new Date().toLocaleTimeString()}</p>
            </article>
          </div>
        </section>
      )}
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
  const [profile, setProfile] = useLocalStorageState(STORAGE_KEYS.profile, null);
  const [onboardingComplete, setOnboardingComplete] = useLocalStorageState(
    STORAGE_KEYS.onboardingComplete,
    false,
  );
  const [preferences, setPreferences] = useLocalStorageState(STORAGE_KEYS.preferences, defaultPreferences);
  const [developerAccounts, setDeveloperAccounts] = useLocalStorageState(
    STORAGE_KEYS.developerAccounts,
    [],
  );
  const [currentView, setCurrentView] = useState('dashboard');
  const [developerDrawerOpen, setDeveloperDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorageState(
    STORAGE_KEYS.sidebarCollapsed,
    false,
  );
  const [theme, setTheme] = useState(preferences.theme || defaultPreferences.theme);
  const userName = profile?.firstName || 'there';
  const todayKey = getLocalDateKey();
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const [sleepEntries, setSleepEntries] = useLocalStorageState(STORAGE_KEYS.sleep, []);
  const [workouts, setWorkouts] = useLocalStorageState(STORAGE_KEYS.workouts, []);
  const [meals, setMeals] = useLocalStorageState(STORAGE_KEYS.meals, []);
  const [habits, setHabits] = useLocalStorageState(STORAGE_KEYS.habits, []);
  const [transactions, setTransactions] = useLocalStorageState(STORAGE_KEYS.transactions, []);
  const [recurringTransactions, setRecurringTransactions] = useLocalStorageState(
    STORAGE_KEYS.recurringTransactions,
    [],
  );
  const [goals, setGoals] = useLocalStorageState(STORAGE_KEYS.goals, []);
  const [diaryEntries, setDiaryEntries] = useLocalStorageState(STORAGE_KEYS.diary, {});
  const [coachMessages, setCoachMessages] = useLocalStorageState(STORAGE_KEYS.coach, []);

  useEffect(() => {
    const nextTheme = preferences.theme || defaultPreferences.theme;
    setTheme(nextTheme);
  }, [preferences.theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    function handleDeveloperShortcut(event) {
      // Toggle developer mode with Ctrl+Shift+D or Cmd+Shift+D on Mac
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setDeveloperDrawerOpen((currentValue) => !currentValue);
      }
    }

    window.addEventListener('keydown', handleDeveloperShortcut);
    return () => window.removeEventListener('keydown', handleDeveloperShortcut);
  }, []);

  const currentViewLabel =
    navigationItems.find((item) => item.view === currentView)?.label ||
    modules.find((module) => module.view === currentView)?.name ||
    'Dashboard';

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
    setCurrentView(view);
  }

  function completeOnboarding(completedProfile) {
    setProfile(completedProfile);
    setOnboardingComplete(true);
  }

  function resetStorageKeyState(keyName) {
    if (keyName === 'profile') setProfile(null);
    if (keyName === 'onboardingComplete') setOnboardingComplete(false);
    if (keyName === 'preferences') setPreferences(defaultPreferences);
    if (keyName === 'dashboardCharts') removeStorageValue(STORAGE_KEYS.dashboardCharts);
    if (keyName === 'developerAccounts') setDeveloperAccounts([]);
    if (keyName === 'sleep') setSleepEntries([]);
    if (keyName === 'workouts') setWorkouts([]);
    if (keyName === 'meals') setMeals([]);
    if (keyName === 'habits') setHabits([]);
    if (keyName === 'transactions') setTransactions([]);
    if (keyName === 'recurringTransactions') setRecurringTransactions([]);
    if (keyName === 'goals') setGoals([]);
    if (keyName === 'diary') setDiaryEntries({});
    if (keyName === 'coach') setCoachMessages([]);
  }

  function deleteStorageKey(keyName) {
    removeStorageValue(STORAGE_KEYS[keyName]);
    resetStorageKeyState(keyName);

    if (keyName === 'profile') {
      setOnboardingComplete(false);
      setCurrentView('dashboard');
    }
  }

  function importStorageSnapshot(snapshot) {
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      if (Object.prototype.hasOwnProperty.call(snapshot, name)) {
        writeStorageValue(key, snapshot[name]);
      }
    });

    setProfile(snapshot.profile || null);
    setOnboardingComplete(Boolean(snapshot.onboardingComplete && snapshot.profile));
    setPreferences(snapshot.preferences || defaultPreferences);
    setDeveloperAccounts(snapshot.developerAccounts || []);
    setSleepEntries(snapshot.sleep || []);
    setWorkouts(snapshot.workouts || []);
    setMeals(snapshot.meals || []);
    setHabits(snapshot.habits || []);
    setTransactions(snapshot.transactions || []);
    setRecurringTransactions(snapshot.recurringTransactions || []);
    setGoals(snapshot.goals || []);
    setDiaryEntries(snapshot.diary || {});
    setCoachMessages(snapshot.coach || []);
  }

  function deleteAccount() {
    const confirmed = window.confirm('Delete this local LifeOS account and all connected data?');
    if (!confirmed) return;

    Object.values(STORAGE_KEYS).forEach((key) => removeStorageValue(key));
    setProfile(null);
    setOnboardingComplete(false);
    setPreferences(defaultPreferences);
    setDeveloperAccounts([]);
    setCurrentView('dashboard');
    setSleepEntries([]);
    setWorkouts([]);
    setMeals([]);
    setHabits([]);
    setTransactions([]);
    setRecurringTransactions([]);
    setGoals([]);
    setDiaryEntries({});
    setCoachMessages([]);
  }

  function renderCurrentView() {
    if (currentView === 'dashboard') {
      return <DashboardView stats={dashboardStats} today={today} userName={userName} />;
    }

    if (currentView === 'settings') {
      return (
        <SettingsView
          developerAccounts={developerAccounts}
          onBack={() => setCurrentView('dashboard')}
          onDeleteAccount={deleteAccount}
          onDeleteStorageKey={deleteStorageKey}
          onImportStorageSnapshot={importStorageSnapshot}
          preferences={preferences}
          profile={profile}
          setDeveloperAccounts={setDeveloperAccounts}
          setPreferences={setPreferences}
          setProfile={setProfile}
        />
      );
    }

    if (currentView === 'sleep') {
      return <SleepView entries={sleepEntries} setEntries={setSleepEntries} onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'gym') {
      return <GymView workouts={workouts} setWorkouts={setWorkouts} onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'nutrition') {
      return <NutritionView meals={meals} setMeals={setMeals} onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'habits') {
      return (
        <HabitsView
          habits={habits}
          onBack={() => setCurrentView('dashboard')}
          setHabits={setHabits}
          todayKey={todayKey}
        />
      );
    }

    if (currentView === 'finance') {
      return (
        <FinanceView
          onBack={() => setCurrentView('dashboard')}
          setTransactions={setTransactions}
          transactions={transactions}
          recurringTransactions={recurringTransactions}
          setRecurringTransactions={setRecurringTransactions}
        />
      );
    }

    if (currentView === 'goals') {
      return (
        <GoalsView
          goals={goals}
          onBack={() => setCurrentView('dashboard')}
          setGoals={setGoals}
          todayKey={todayKey}
        />
      );
    }

    if (currentView === 'diary') {
      return (
        <DiaryView
          diaryEntries={diaryEntries}
          onBack={() => setCurrentView('dashboard')}
          setDiaryEntries={setDiaryEntries}
          todayKey={todayKey}
        />
      );
    }

    if (currentView === 'coach') {
      return (
        <CoachView
          messages={coachMessages}
          onBack={() => setCurrentView('dashboard')}
          setMessages={setCoachMessages}
        />
      );
    }

    return (
      <div style={viewStyles.stack}>
        <ModuleHeader
          eyebrow={currentViewLabel}
          title={currentViewLabel}
          subtitle="This view is ready to be connected next."
          onBack={() => setCurrentView('dashboard')}
        />
        <section style={viewStyles.panel}>
          <EmptyState>{currentViewLabel} has no module UI yet.</EmptyState>
        </section>
      </div>
    );
  }

  if (!profile || !onboardingComplete) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <div className={`lifeos-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'}`} aria-label="LifeOS navigation">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={22} aria-hidden="true" />
          </div>
          <div className="brand-copy">
            <span className="brand-name">LifeOS</span>
            <span className="brand-label">Personal command center</span>
          </div>
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setSidebarCollapsed((currentValue) => !currentValue)}
          >
            {sidebarCollapsed ? '›' : '‹'}
          </button>
        </div>

        <nav className="nav-list">
          {navigationItems.map(({ label, view, icon: Icon }) => (
            <button
              className={`nav-item ${view === currentView ? 'active' : ''}`}
              key={label}
              type="button"
              onClick={() => openView(view, label)}
              title={label}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;


