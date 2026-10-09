import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

export type ThemeName = 'noir' | 'champagne' | 'rose' | 'orquidea' | 'esmeralda' | 'caribe' | 'terracota' | 'medianoche';
export type ThemeMode = 'light' | 'dark' | 'system';
export interface ThemeOption { name: ThemeName; label: string; swatch: string }

const THEME_KEY = 'owney.theme';
const MODE_KEY = 'owney.mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly media = matchMedia('(prefers-color-scheme: dark)');
  readonly themes: readonly ThemeOption[] = [
    { name: 'noir', label: 'Owney Noir', swatch: '#0A0A0A' },
    { name: 'champagne', label: 'Champagne', swatch: '#8C6B3A' },
    { name: 'rose', label: 'Rosé', swatch: '#A3264A' },
    { name: 'orquidea', label: 'Orquídea', swatch: '#6D28D9' },
    { name: 'esmeralda', label: 'Esmeralda', swatch: '#047857' },
    { name: 'caribe', label: 'Caribe', swatch: '#0E7490' },
    { name: 'terracota', label: 'Terracota', swatch: '#A84B23' },
    { name: 'medianoche', label: 'Medianoche', swatch: '#1E2A4A' },
  ];
  readonly theme = signal<ThemeName>(this.readTheme());
  readonly mode = signal<ThemeMode>(this.readMode());

  constructor() {
    const onSystemChange = () => this.apply();
    this.media.addEventListener('change', onSystemChange);
    inject(DestroyRef).onDestroy(() => this.media.removeEventListener('change', onSystemChange));
    this.apply();
  }

  setTheme(theme: ThemeName) { this.theme.set(theme); localStorage.setItem(THEME_KEY, theme); this.apply(); }
  setMode(mode: ThemeMode) { this.mode.set(mode); localStorage.setItem(MODE_KEY, mode); this.apply(); }

  private apply() {
    const root = this.document.documentElement;
    root.dataset['theme'] = this.theme();
    root.classList.toggle('dark', this.mode() === 'dark' || (this.mode() === 'system' && this.media.matches));
  }

  private readTheme(): ThemeName {
    const value = localStorage.getItem(THEME_KEY) as ThemeName | null;
    return this.themes.some(item => item.name === value) ? value! : 'noir';
  }

  private readMode(): ThemeMode {
    const value = localStorage.getItem(MODE_KEY) as ThemeMode | null;
    return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
  }
}
