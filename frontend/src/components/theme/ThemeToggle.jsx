import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const withThemeTransition = (action) => {
    // Add a temporary class to enable smooth color transitions
    const root = document.documentElement;
    root.classList.add('theme-transition');
    try {
      action();
    } finally {
      // Remove the class after a short delay to restore original state
      window.setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 300);
    }
  };

  return (
    <div className={`theme-toggle-container ${theme === 'dark' ? 'dark' : ''}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="theme-toggle-button">
            <Sun className="theme-toggle-icon sun" />
            <Moon className="theme-toggle-icon moon" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => withThemeTransition(() => toggleTheme('light'))}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => withThemeTransition(() => toggleTheme('dark'))}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => withThemeTransition(() => toggleTheme('system'))}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
