import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/Button';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="rounded-full p-2"
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-600" />
            ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
            )}
        </Button>
    );
}
