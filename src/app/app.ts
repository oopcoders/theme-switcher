import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColor = 'blue' | 'red' | 'green';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly modeStorageKey = 'theme-switcher-mode';
  private readonly colorStorageKey = 'theme-switcher-color';

  protected readonly title = 'Theme Switcher Demo';
  protected readonly selectedMode = signal<ThemeMode>(this.getSavedMode());
  protected readonly selectedColor = signal<ThemeColor>(this.getSavedColor());

  constructor() {
    this.applyTheme();
  }

  protected setMode(mode: ThemeMode) {
    this.selectedMode.set(mode);
    this.applyTheme();

    if (this.isBrowser) {
      localStorage.setItem(this.modeStorageKey, mode);
    }
  }

  protected setColor(color: ThemeColor) {
    this.selectedColor.set(color);
    this.applyTheme();

    if (this.isBrowser) {
      localStorage.setItem(this.colorStorageKey, color);
    }
  }

  protected themeLabel() {
    return `${this.toLabel(this.selectedMode())} ${this.toLabel(this.selectedColor())}`;
  }

  private getSavedMode(): ThemeMode {
    if (!this.isBrowser) {
      return 'system';
    }

    const savedMode = localStorage.getItem(this.modeStorageKey);
    return savedMode === 'light' || savedMode === 'dark' || savedMode === 'system'
      ? savedMode
      : 'system';
  }

  private getSavedColor(): ThemeColor {
    if (!this.isBrowser) {
      return 'blue';
    }

    const savedColor = localStorage.getItem(this.colorStorageKey);
    return savedColor === 'blue' || savedColor === 'red' || savedColor === 'green'
      ? savedColor
      : 'blue';
  }

  private applyTheme() {
    this.document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');
    this.document.body.classList.remove('theme-blue', 'theme-red', 'theme-green');
    this.document.body.classList.add(`theme-${this.selectedMode()}`, `theme-${this.selectedColor()}`);
  }

  private toLabel(value: ThemeMode | ThemeColor) {
    return value[0].toUpperCase() + value.slice(1);
  }
}
