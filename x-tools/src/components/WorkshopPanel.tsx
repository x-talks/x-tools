import { useState, useEffect } from 'react';
import { useWizard } from '../core/store';
import { Play, Pause, Users, Vote, MessageSquare, ArrowRight } from 'lucide-react';


export function WorkshopPanel({ onClose }: { onClose: () => void }) {
    const { state, dispatch } = useWizard();
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // In a real app, this would be synced via websocket
    // Here we simulate the workshop state locally
    // Ensure we have a valid session object with array for participants to allow map() to work
    const defaultSession = {
        isActive: false,
        code: 'W-' + Math.floor(Math.random() * 10000),
        facilitatorId: 'me',
        participants: [
            { id: '1', name: 'Alice', active: true },
            { id: '2', name: 'Bob', active: true },
            { id: '3', name: 'Charlie', active: false },
        ],
        stage: 'brainstorming' as const,
        timer: { secondsRemaining: 300, status: 'paused' as const }
    };

    const session = (state.workshop && state.workshop.participants) ? state.workshop : defaultSession;

    useEffect(() => {
        let interval: any;
        if (session.timer?.status === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((t) => Math.max(0, t - 1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [session.timer?.status, timeLeft]);

    const toggleTimer = () => {
        const newStatus = session.timer?.status === 'running' ? 'paused' : 'running';
        dispatch({
            type: 'UPDATE_WORKSHOP',
            payload: {
                timer: { secondsRemaining: timeLeft, status: newStatus }
            }
        });
        // Actually start/stop local timer effect
        if (newStatus === 'running') {
            setTimeLeft(session.timer?.secondsRemaining || 300);
        }
    };

    const nextStage = () => {
        const stages: ('brainstorming' | 'voting' | 'review')[] = ['brainstorming', 'voting', 'review'];
        const currentIdx = stages.indexOf(session.stage as any);
        const next = stages[(currentIdx + 1) % stages.length];
        dispatch({ type: 'UPDATE_WORKSHOP', payload: { stage: next } });
    };

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 flex flex-col">
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="font-bold">Workshop Mode</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-indigo-500 rounded"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Code & Participants */}
            <div className="p-4 bg-indigo-50 dark:bg-slate-800/50 border-b border-indigo-100 dark:border-slate-700">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Session Code</span>
                    <span className="font-mono text-xl font-bold tracking-widest text-indigo-600 dark:text-indigo-400">{session.code}</span>
                </div>
                <div className="flex -space-x-2 overflow-hidden py-1">
                    {session.participants.map(p => (
                        <div key={p.id} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-white ${p.active ? 'bg-green-500' : 'bg-slate-400'}`} title={p.name}>
                            {p.name[0]}
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-500">
                        +2
                    </div>
                </div>
            </div>

            {/* Timer & Controls */}
            <div className="p-6 flex flex-col items-center justify-center space-y-4 border-b border-slate-200 dark:border-slate-700">
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-indigo-100 dark:border-slate-700">
                    <span className={`text-4xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                    <div className="absolute -bottom-2 px-3 py-1 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-500 rounded-full border shadow-sm">
                        {session.stage.toUpperCase()}
                    </div>
                </div>

                <div className="flex gap-2 w-full">
                    <button
                        onClick={toggleTimer}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-white transition-colors ${session.timer?.status === 'running' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {session.timer?.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {session.timer?.status === 'running' ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={nextStage}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 rounded-lg"
                        title="Next Stage"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tools Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Facilitator Tools</div>

                <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 transition-colors group">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Vote className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="font-medium text-slate-900 dark:text-slate-100">Start Voting</div>
                        <div className="text-xs text-slate-500">Ask team to vote on current items</div>
                    </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 transition-colors group">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="font-medium text-slate-900 dark:text-slate-100">Broadcast Prompt</div>
                        <div className="text-xs text-slate-500">Send a question to everyone's screen</div>
                    </div>
                </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                Connected to {session.participants.length} devices
            </div>
        </div>
    );
}
