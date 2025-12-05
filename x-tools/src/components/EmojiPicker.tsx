import { useState } from 'react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
    currentEmoji?: string;
    onEmojiChange: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
    'Targets & Goals': ['🎯', '🎪', '🏆', '⭐', '✨', '💫', '🌟', '🔥'],
    'Direction': ['🚀', '🧭', '📍', '🗺️', '⬆️', '➡️', '⏩', '🔜'],
    'Team & People': ['👥', '🤝', '💪', '👊', '✊', '🙌', '👏', '🫱'],
    'Ideas & Innovation': ['💡', '🧠', '💭', '🎨', '✏️', '📝', '🔬', '🔭'],
    'Success & Growth': ['📈', '📊', '💰', '💎', '🏅', '🥇', '🎖️', '👑'],
    'Values': ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍'],
    'Communication': ['💬', '📢', '📣', '🔔', '📡', '🎤', '📻', '📞'],
    'Tools & Work': ['⚙️', '🔧', '🔨', '🛠️', '⚡', '🔑', '🔒', '🔓'],
};

export function EmojiPicker({ currentEmoji, onEmojiChange }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(EMOJI_CATEGORIES)[0]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Add emoji"
            >
                {currentEmoji ? (
                    <span className="text-lg">{currentEmoji}</span>
                ) : (
                    <Smile className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Emoji Palette */}
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-80">
                        {/* Header */}
                        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Choose Emoji
                                </div>
                                {currentEmoji && (
                                    <button
                                        onClick={() => {
                                            onEmojiChange('');
                                            setIsOpen(false);
                                        }}
                                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            {/* Category Tabs */}
                            <div className="flex gap-1 overflow-x-auto pb-1">
                                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-2 py-1 text-[10px] rounded whitespace-nowrap transition-colors ${selectedCategory === category
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Emoji Grid */}
                        <div className="p-3 max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-8 gap-1">
                                {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => {
                                            onEmojiChange(emoji);
                                            setIsOpen(false);
                                        }}
                                        className={`w-9 h-9 flex items-center justify-center text-xl rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-125 ${currentEmoji === emoji ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' : ''
                                            }`}
                                        title={emoji}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                                Click emoji to select • Click outside to close
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
