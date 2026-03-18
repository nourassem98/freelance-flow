"use client"

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  Bell,
  User,
  Mic,
  MicOff,
  Send,
  FileText,
  FolderKanban,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Trash2,
  Play,
  Pause,
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

interface ExtractedItem {
  id: string;
  type: 'invoice' | 'project' | 'meeting' | 'deadline';
  title: string;
  details: string;
  date?: string;
  amount?: string;
  client?: string;
  priority?: 'high' | 'medium' | 'low';
  status: 'pending' | 'created';
}

const AIAgentPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("AI Agent");

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

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const processInput = async () => {
    if (!textInput.trim() && !audioBlob) return;

    setIsProcessing(true);
    setShowResults(false);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockExtractedItems: ExtractedItem[] = [];
    const text = textInput.toLowerCase();

    if (text.includes('invoice') || text.includes('bill') || text.includes('payment')) {
      mockExtractedItems.push({
        id: Date.now().toString(),
        type: 'invoice',
        title: 'Create Invoice',
        details: 'Generate invoice for client work',
        amount: '$2,500',
        client: 'Acme Corp',
        priority: 'high',
        status: 'pending'
      });
    }

    if (text.includes('project') || text.includes('website') || text.includes('design')) {
      mockExtractedItems.push({
        id: (Date.now() + 1).toString(),
        type: 'project',
        title: 'New Project Task',
        details: 'Add task to existing project',
        priority: 'medium',
        status: 'pending'
      });
    }

    if (text.includes('meeting') || text.includes('call') || text.includes('discuss')) {
      mockExtractedItems.push({
        id: (Date.now() + 2).toString(),
        type: 'meeting',
        title: 'Schedule Meeting',
        details: 'Set up client meeting',
        date: '2026-03-18',
        priority: 'medium',
        status: 'pending'
      });
    }

    if (text.includes('deadline') || text.includes('due') || text.includes('submit')) {
      mockExtractedItems.push({
        id: (Date.now() + 3).toString(),
        type: 'deadline',
        title: 'Set Deadline',
        details: 'Add deadline to calendar',
        date: '2026-03-20',
        priority: 'high',
        status: 'pending'
      });
    }

    if (mockExtractedItems.length === 0) {
      mockExtractedItems.push({
        id: Date.now().toString(),
        type: 'project',
        title: 'General Task',
        details: textInput || 'Voice message recorded',
        priority: 'low',
        status: 'pending'
      });
    }

    setExtractedItems(mockExtractedItems);
    setIsProcessing(false);
    setShowResults(true);
  };

  const createItem = (item: ExtractedItem) => {
    setExtractedItems(prev => 
      prev.map(i => i.id === item.id ? { ...i, status: 'created' } : i)
    );
    alert(`Created ${item.type}: ${item.title}`);
  };

  const createAllItems = () => {
    extractedItems.forEach(item => {
      if (item.status === 'pending') {
        createItem(item);
      }
    });
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'invoice': return <FileText className="h-5 w-5" />;
      case 'project': return <FolderKanban className="h-5 w-5" />;
      case 'meeting': return <Calendar className="h-5 w-5" />;
      case 'deadline': return <Clock className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'invoice': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'project': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'meeting': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'deadline': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-indigo-600" />
                AI Agent
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Record or type a message, and AI will automatically create invoices, projects, meetings, or deadlines
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Voice Recording Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Mic className="h-5 w-5 text-indigo-600" />
                    Voice Recording
                  </h2>

                  <div className="flex flex-col items-center justify-center py-8">
                    {!audioBlob ? (
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="h-10 w-10 text-white" />
                        ) : (
                          <Mic className="h-10 w-10 text-white" />
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={isPlaying ? pauseAudio : playAudio}
                          className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="h-8 w-8 text-white" />
                          ) : (
                            <Play className="h-8 w-8 text-white" />
                          )}
                        </button>
                        <button
                          onClick={deleteRecording}
                          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="h-6 w-6 text-white" />
                        </button>
                      </div>
                    )}

                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                      {isRecording
                        ? 'Recording... Click to stop'
                        : audioBlob
                        ? 'Recording ready. Play or delete.'
                        : 'Click to start recording'}
                    </p>
                  </div>
                </div>

                {/* Text Input Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Send className="h-5 w-5 text-indigo-600" />
                    Text Input
                  </h2>

                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your message here... e.g., 'Create an invoice for $2500 for Acme Corp website redesign due next Friday'"
                    className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 resize-none"
                  />

                  <button
                    onClick={processInput}
                    disabled={isProcessing || (!textInput.trim() && !audioBlob)}
                    className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Process with AI
                      </>
                    )}
                  </button>
                </div>

                {/* Example Prompts */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-6">
                  <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-3">Example Prompts:</h3>
                  <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">•</span>
                      "Create an invoice for $3000 for the mobile app project"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">•</span>
                      "Schedule a meeting with John tomorrow at 2 PM"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">•</span>
                      "Add a deadline for the website redesign next Friday"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">•</span>
                      "Create a new project task for the logo design"
                    </li>
                  </ul>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {showResults && extractedItems.length > 0 ? (
                  <>
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Extracted Items
                        </h2>
                        <button
                          onClick={createAllItems}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
                        >
                          Create All
                        </button>
                      </div>

                      <div className="space-y-3">
                        {extractedItems.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-lg border ${getItemColor(item.type)} ${
                              item.status === 'created' ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="mt-1">{getItemIcon(item.type)}</div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{item.title}</h3>
                                    <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                      {item.priority}
                                    </span>
                                  </div>
                                  <p className="text-sm opacity-75 mt-1">{item.details}</p>
                                  <div className="flex items-center gap-4 mt-2 text-xs opacity-75">
                                    {item.client && <span>Client: {item.client}</span>}
                                    {item.amount && <span>Amount: {item.amount}</span>}
                                    {item.date && <span>Date: {item.date}</span>}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => createItem(item)}
                                disabled={item.status === 'created'}
                                className="px-3 py-1.5 bg-white border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
                              >
                                {item.status === 'created' ? 'Created' : 'Create'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-4">Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/20 rounded-lg p-3">
                          <p className="text-sm opacity-75">Invoices</p>
                          <p className="text-2xl font-bold">
                            {extractedItems.filter(i => i.type === 'invoice').length}
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <p className="text-sm opacity-75">Projects</p>
                          <p className="text-2xl font-bold">
                            {extractedItems.filter(i => i.type === 'project').length}
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <p className="text-sm opacity-75">Meetings</p>
                          <p className="text-2xl font-bold">
                            {extractedItems.filter(i => i.type === 'meeting').length}
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <p className="text-sm opacity-75">Deadlines</p>
                          <p className="text-2xl font-bold">
                            {extractedItems.filter(i => i.type === 'deadline').length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
                    <Sparkles className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Results Yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Record a voice message or type text, then click "Process with AI" to extract items
                    </p>
                  </div>
                )}
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
          Icon={Sparkles}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Sparkles}
          title="AI Agent"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Mic}
          title="Voice Commands"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FileText}
          title="Extractions"
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Agent</h2>
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

export default AIAgentPage;