'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react';

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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 15)); // March 15, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 15));
  const [newTodo, setNewTodo] = useState('');

  // Sample data for demonstration
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
    
    // Add empty days for the start of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="mt-2 text-gray-600">
              Manage your deadlines, meetings, and to-do lists
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
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
                              ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="font-medium">{day}</span>
                          {hasEvents(day) && (
                            <div className="flex gap-0.5 mt-1">
                              <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
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
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDate
                    ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                    : 'Select a date'}
                </h3>

                {selectedDate && (
                  <>
                    {/* Deadlines Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
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
                        <p className="text-sm text-gray-500">No deadlines scheduled</p>
                      )}
                    </div>

                    {/* To-Do List Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
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
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={addTodo}
                          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group"
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
                                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                                }`}
                              >
                                {todo.text}
                              </span>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No tasks for this day</p>
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
  );
}