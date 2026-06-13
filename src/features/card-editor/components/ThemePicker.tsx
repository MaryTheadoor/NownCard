import { cn } from "@/shared/lib/utils/cn";
import { themeOptions, type CardFormData } from "../types";

interface ThemePickerProps {
  value: CardFormData["theme"];
  onChange: (theme: CardFormData["theme"]) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

const themeLabels: Record<CardFormData["theme"], { label: string; colors: string }> = {
  cosmic: { label: "Cosmic", colors: "bg-indigo-600, from-indigo-600 to-purple-600" },
  warm: { label: "Warm", colors: "bg-amber-500, from-amber-500 to-orange-500" },
  minimal: { label: "Minimal", colors: "bg-gray-800, from-gray-800 to-gray-900" },
};

export function ThemePicker({ value, onChange, accentColor, onAccentColorChange }: ThemePickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Theme</p>
      <div className="flex gap-3">
        {themeOptions.map((theme) => (
          <button
            key={theme}
            type="button"
            className={cn(
              "flex-1 rounded-lg border p-3 text-center text-sm transition-colors",
              value === theme ? "border-brand bg-brand/5 ring-2 ring-brand/20" : "border-gray-200 hover:border-gray-300",
            )}
            onClick={() => onChange(theme)}
          >
            <div className={cn("mx-auto mb-2 h-8 w-full rounded", { "bg-gradient-to-r from-indigo-600 to-purple-600": theme === "cosmic", "bg-gradient-to-r from-amber-500 to-orange-500": theme === "warm", "bg-gradient-to-r from-gray-800 to-gray-900": theme === "minimal" })} />
            {themeLabels[theme].label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">Accent color:</p>
        <input
          type="color"
          value={accentColor}
          onChange={(e) => onAccentColorChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded border"
        />
        <span className="text-sm text-gray-500">{accentColor}</span>
      </div>
    </div>
  );
}
