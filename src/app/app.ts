import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = 'theme-switcher-mode';

  protected readonly title = 'Theme Switcher Demo';
  protected readonly selectedTheme = signal<ThemeMode>(this.getSavedTheme());

  constructor() {
    this.applyTheme(this.selectedTheme());
  }

  protected setTheme(theme: ThemeMode) {
    this.selectedTheme.set(theme);
    this.applyTheme(theme);

    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, theme === 'dark' ? 'light' : theme);
    }
  }

  protected themeLabel() {
    return this.selectedTheme()[0].toUpperCase() + this.selectedTheme().slice(1);
  }

  private getSavedTheme(): ThemeMode {
    if (!this.isBrowser) {
      return 'system';
    }

    const savedTheme = localStorage.getItem(this.storageKey);
    return savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
      ? savedTheme
      : 'system';
  }

  private applyTheme(theme: ThemeMode) {
    this.document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');
    this.document.body.classList.add(`theme-${theme}`);
  }
}
