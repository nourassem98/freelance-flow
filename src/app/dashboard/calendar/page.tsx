"use client"

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Moon,
  Sun,
  Bell,
  User,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Milestone,
} from "lucide-react";

interface OptionProps {
  Icon: React.ElementType;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
}

interface TitleSectionProps {
  open: boolean;
}

interface ToggleCloseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Deadline {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'deadline' | 'meeting' | 'milestone';
}

interface DayData {
  todos: TodoItem[];
  deadlines: Deadline[];
}

const CalendarPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Calendar");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 15));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 15));
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (page: string) => {
    setSelected(page);
  };

  // Sample calendar data
  const [calendarData, setCalendarData] = useState<Record<string, DayData>>({
    '2026-03-15': {
      todos: [
        { id: '1', text: 'Review project proposal', completed: false },
        { id: '2', text: 'Send invoice to Acme Corp', completed: true },
        { id: '3', text: 'Update portfolio website', completed: false },
      ],
      deadlines: [
        { id: '1', title: 'Website Redesign Delivery', client: 'TechStart Inc', time: '5:00 PM', type: 'deadline' },
        { id: '2', title: 'Client Meeting', client: 'Global Solutions', time: '2:00 PM', type: 'meeting' },
      ],
    },
    '2026-03-18': {
      todos: [
        { id: '4', text: 'Complete brand guidelines', completed: false },
      ],
      deadlines: [
        { id: '3', title: 'Brand Identity Milestone', client: 'StartupXYZ', time: '12:00 PM', type: 'milestone' },
      ],
    },
    '2026-03-20': {
      todos: [],
      deadlines: [
        { id: '4', title: 'Invoice Due - March', client: 'All Clients', time: '11:59 PM', type: 'deadline' },
      ],
    },
    '2026-03-22': {
      todos: [
        { id: '5', text: 'Prepare presentation', completed: false },
        { id: '6', text: 'Review contract terms', completed: false },
      ],
      deadlines: [
        { id: '5', title: 'Project Kickoff Meeting', client: 'New Client Inc', time: '10:00 AM', type: 'meeting' },
      ],
    },
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasEvents = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const data = calendarData[dateKey];
    return data && (data.todos.length > 0 || data.deadlines.length > 0);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const addTodo = () => {
    if (!newTodo.trim() || !selectedDate) return;

    const dateKey = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const currentData = calendarData[dateKey] || { todos: [], deadlines: [] };
    
    setCalendarData({
      ...calendarData,
      [dateKey]: {
        ...currentData,
        todos: [
          ...currentData.todos,
          { id: Date.now().toString(), text: newTodo, completed: false }
        ],
      },
    });
    setNewTodo('');
  };

  const toggleTodo = (todoId: string) => {
    if (!selectedDate) return;

    const dateKey = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const currentData = calendarData[dateKey];
    
    if (!currentData) return;

    setCalendarData({
      ...calendarData,
      [dateKey]: {
        ...currentData,
        todos: currentData.todos.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
      },
    });
  };

  const deleteTodo = (todoId: string) => {
    if (!selectedDate) return;

    const dateKey = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const currentData = calendarData[dateKey];
    
    if (!currentData) return;

    setCalendarData({
      ...calendarData,
      [dateKey]: {
        ...currentData,
        todos: currentData.todos.filter(todo => todo.id !== todoId),
      },
    });
  };

  const getSelectedDateData = (): DayData => {
    if (!selectedDate) return { todos: [], deadlines: [] };
    const dateKey = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    return calendarData[dateKey] || { todos: [], deadlines: [] };
  };

  const selectedDateData = getSelectedDateData();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDeadlineTypeColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'meeting': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'milestone': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDeadlineIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="h-4 w-4" />;
      case 'meeting': return <User className="h-4 w-4" />;
      case 'milestone': return <Milestone className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar 
          open={open}
          setOpen={setOpen}
          selected={selected}
          setSelected={handleNavigate}
        />
        
        {/* Main content */}
        <div className="flex-1">
          <Header isDark={isDark} setIsDark={setIsDark} />
          
          <main className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your deadlines, meetings, and to-do lists
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Grid */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth(currentDate).map((day, index) => (
                      <div key={index} className="aspect-square">
                        {day !== null && (
                          <button
                            onClick={() => handleDateClick(day)}
                            className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                              selectedDate?.getDate() === day &&
                              selectedDate?.getMonth() === currentDate.getMonth() &&
                              selectedDate?.getFullYear() === currentDate.getFullYear()
                                ? 'bg-indigo-600 text-white'
                                : hasEvents(day)
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span className="font-medium">{day}</span>
                            {hasEvents(day) && (
                              <div className="flex gap-0.5 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Date Details */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {selectedDate
                      ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                      : 'Select a date'}
                  </h3>

                  {selectedDate && (
                    <>
                      {/* Deadlines Section */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Deadlines & Meetings
                        </h4>
                        {selectedDateData.deadlines.length > 0 ? (
                          <div className="space-y-2">
                            {selectedDateData.deadlines.map((deadline) => (
                              <div
                                key={deadline.id}
                                className={`p-3 rounded-lg border ${getDeadlineTypeColor(deadline.type)}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-sm">{deadline.title}</p>
                                    <p className="text-xs opacity-75 mt-1">{deadline.client}</p>
                                  </div>
                                  <span className="text-xs font-medium">{deadline.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No deadlines scheduled</p>
                        )}
                      </div>

                      {/* To-Do List Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          To-Do List
                        </h4>

                        {/* Add Todo Input */}
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="Add a task..."
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                          />
                          <button
                            onClick={addTodo}
                            className="p-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Todo Items */}
                        {selectedDateData.todos.length > 0 ? (
                          <div className="space-y-2">
                            {selectedDateData.todos.map((todo) => (
                              <div
                                key={todo.id}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
                              >
                                <button
                                  onClick={() => toggleTodo(todo.id)}
                                  className="flex-shrink-0"
                                >
                                  {todo.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                                <span
                                  className={`flex-1 text-sm ${
                                    todo.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {todo.text}
                                </span>
                                <button
                                  onClick={() => deleteTodo(todo.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No tasks for this day</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ open, setOpen, selected, setSelected }: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string;
  setSelected: (title: string) => void;
}) => {
  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8">
        <Option
          Icon={CalendarIcon}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={CalendarIcon}
          title="Calendar"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Clock}
          title="Schedule"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={CheckCircle2}
          title="Tasks"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Account
          </div>
          <Option
            Icon={User}
            title="Profile"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={Moon}
            title="Settings"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }: OptionProps) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span className="text-sm font-medium transition-opacity duration-200">
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open }: TitleSectionProps) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className="transition-opacity duration-200">
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Freelance Flow
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Pro Plan
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
      <svg
        width="20"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
      </svg>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: ToggleCloseProps) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200">
            Hide
          </span>
        )}
      </div>
    </button>
  );
};

const Header = ({ isDark, setIsDark }: { isDark: boolean; setIsDark: (isDark: boolean) => void }) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Calendar</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CalendarPage;