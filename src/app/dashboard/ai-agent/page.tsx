'use client'

import { useState, useRef } from 'react'
import {
  Sparkles,
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
} from 'lucide-react'
import { parseVoiceNoteToActions } from '@/modules/ai/parseVoiceNote'
import type { AIAction, AIActionType } from '@/lib/crm-types'

const typeIcon: Record<AIActionType, React.ReactNode> = {
  invoice:  <FileText className="h-5 w-5" />,
  deal:     <Sparkles className="h-5 w-5" />,
  project:  <FolderKanban className="h-5 w-5" />,
  meeting:  <Calendar className="h-5 w-5" />,
  deadline: <Clock className="h-5 w-5" />,
}

const typeColor: Record<AIActionType, string> = {
  invoice:  'bg-green-500/20 text-green-400 border-green-500/30',
  deal:     'bg-purple-500/20 text-purple-400 border-purple-500/30',
  project:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  meeting:  'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  deadline: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const priorityColor: Record<string, string> = {
  high:   'text-red-500',
  medium: 'text-yellow-500',
  low:    'text-green-500',
}

export default function AIAgentPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [actions, setActions] = useState<(AIAction & { status: 'pending' | 'created' })[]>([])
  const [showResults, setShowResults] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
      }
      mr.start()
      setIsRecording(true)
    } catch {
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const playAudio = () => {
    if (!audioUrl) return
    audioRef.current?.pause()
    audioRef.current = new Audio(audioUrl)
    audioRef.current.play()
    setIsPlaying(true)
    audioRef.current.onended = () => setIsPlaying(false)
  }

  const pauseAudio = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const deleteRecording = () => {
    audioRef.current?.pause()
    audioRef.current = null
    setAudioBlob(null)
    setAudioUrl(null)
    setIsPlaying(false)
  }

  const processInput = async () => {
    if (!textInput.trim() && !audioBlob) return
    setIsProcessing(true)
    setShowResults(false)

    // Simulate processing delay (swap for real Whisper + Claude API here)
    await new Promise((r) => setTimeout(r, 1500))

    const transcript = textInput || 'Voice note recorded'
    const parsed = parseVoiceNoteToActions(transcript)
    setActions(parsed.map((a) => ({ ...a, status: 'pending' })))
    setIsProcessing(false)
    setShowResults(true)
  }

  const createAction = (index: number) => {
    setActions((prev) =>
      prev.map((a, i) => (i === index ? { ...a, status: 'created' } : a))
    )
  }

  const createAll = () => setActions((prev) => prev.map((a) => ({ ...a, status: 'created' })))

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-indigo-600" />
          AI Agent
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Record or type a message — AI will extract invoices, deals, projects, meetings,
          and deadlines automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input column */}
        <div className="space-y-6">
          {/* Voice recorder */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Mic className="h-5 w-5 text-indigo-600" /> Voice Recording
            </h2>
            <div className="flex flex-col items-center py-8">
              {!audioBlob ? (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
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
                  ? 'Recording… click to stop'
                  : audioBlob
                  ? 'Recording ready — play or delete'
                  : 'Click to start recording'}
              </p>
            </div>
          </div>

          {/* Text input */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Send className="h-5 w-5 text-indigo-600" /> Text Input
            </h2>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Try: "Client Ahmed confirmed project for $5000 USD starting next week"`}
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 resize-none"
            />
            <button
              onClick={processInput}
              disabled={isProcessing || (!textInput.trim() && !audioBlob)}
              className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" /> Process with AI
                </>
              )}
            </button>
          </div>

          {/* Example prompts */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-5">
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-3">
              Example prompts
            </h3>
            <ul className="space-y-1.5 text-sm text-indigo-800 dark:text-indigo-200">
              {[
                '"Client Ahmed confirmed project for $5000 USD starting next week"',
                '"Create an invoice for $3000 for the mobile app project"',
                '"Schedule a meeting with John tomorrow at 2 PM"',
                '"Add a deadline for the website redesign due next Friday"',
              ].map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                  onClick={() => setTextInput(p.replace(/^"|"$/g, ''))}
                >
                  <span className="text-indigo-400 mt-0.5">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Results column */}
        <div>
          {showResults && actions.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" /> Extracted Actions
                  </h2>
                  <button
                    onClick={createAll}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
                  >
                    Create All
                  </button>
                </div>

                <div className="space-y-3">
                  {actions.map((action, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${typeColor[action.type]} ${
                        action.status === 'created' ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{typeIcon[action.type]}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{action.title}</p>
                              <span
                                className={`text-xs font-medium ${priorityColor[action.priority]}`}
                              >
                                {action.priority}
                              </span>
                            </div>
                            <p className="text-xs opacity-75 mt-1">{action.details}</p>
                            <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-wide opacity-60">
                              {action.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => createAction(i)}
                          disabled={action.status === 'created'}
                          className="ml-4 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
                        >
                          {action.status === 'created' ? '✓ Created' : 'Create'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['invoice', 'deal', 'project', 'meeting', 'deadline'] as AIActionType[]).map(
                    (type) => {
                      const count = actions.filter((a) => a.type === type).length
                      if (count === 0) return null
                      return (
                        <div key={type} className="bg-white/20 rounded-lg p-3">
                          <p className="text-sm opacity-75 capitalize">{type}s</p>
                          <p className="text-2xl font-bold">{count}</p>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center h-full min-h-64">
              <Sparkles className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Results Yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Record a voice note or type a message, then click{' '}
                <strong>Process with AI</strong> to extract CRM actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
