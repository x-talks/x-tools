import { useState } from 'react';
import { Palette, Check } from 'lucide-react';

interface ColorPickerProps {
    currentColor?: string;
    onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
    { name: 'Orange', value: '#f97316', textColor: '#ffffff' },
    { name: 'Purple', value: '#9333ea', textColor: '#ffffff' },
    { name: 'Sky Blue', value: '#0ea5e9', textColor: '#ffffff' },
    { name: 'Green', value: '#10b981', textColor: '#ffffff' },
    { name: 'Pink', value: '#ec4899', textColor: '#ffffff' },
    { name: 'Red', value: '#ef4444', textColor: '#ffffff' },
    { name: 'Cyan', value: '#06b6d4', textColor: '#ffffff' },
    { name: 'Yellow', value: '#eab308', textColor: '#000000' },
    { name: 'Indigo', value: '#6366f1', textColor: '#ffffff' },
    { name: 'Emerald', value: '#059669', textColor: '#ffffff' },
    { name: 'Rose', value: '#f43f5e', textColor: '#ffffff' },
    { name: 'Violet', value: '#8b5cf6', textColor: '#ffffff' },
    { name: 'Amber', value: '#f59e0b', textColor: '#000000' },
    { name: 'Teal', value: '#14b8a6', textColor: '#ffffff' },
    { name: 'Slate', value: '#64748b', textColor: '#ffffff' },
    { name: 'Lime', value: '#84cc16', textColor: '#000000' },
];

export function ColorPicker({ currentColor, onColorChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Change node color"
            >
                <div className="flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <div
                        className="w-4 h-4 rounded border-2 border-white dark:border-slate-800 shadow-sm"
                        style={{ backgroundColor: currentColor || '#e2e8f0' }}
                    />
                </div>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Color Palette */}
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 w-64">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Choose Color
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => {
                                        onColorChange(color.value);
                                        setIsOpen(false);
                                    }}
                                    className="relative w-12 h-12 rounded-lg border-2 border-transparent hover:border-blue-400 transition-all hover:scale-110"
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                >
                                    {currentColor === color.value && (
                                        <Check
                                            className="absolute inset-0 m-auto w-5 h-5"
                                            style={{ color: color.textColor }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Custom Color Input */}
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                                Custom Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={currentColor || '#e2e8f0'}
                                    onChange={(e) => onColorChange(e.target.value)}
                                    className="w-12 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={currentColor || '#e2e8f0'}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                                            onColorChange(value);
                                        }
                                    }}
                                    placeholder="#000000"
                                    className="flex-1 px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
