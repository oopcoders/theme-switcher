import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  const storageKey = 'theme-switcher-mode';

  beforeEach(async () => {
    localStorage.clear();
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');
  });

  function setupApp() {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    return {
      compiled: fixture.nativeElement as HTMLElement,
      fixture,
    };
  }

  function clickTheme(compiled: HTMLElement, label: string) {
    const button = Array.from(compiled.querySelectorAll('button')).find((themeButton) =>
      themeButton.textContent?.includes(label),
    );

    expect(button).toBeTruthy();
    button?.click();
  }

  function currentThemeText(compiled: HTMLElement) {
    return compiled.querySelector('.current-theme')?.textContent?.trim();
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const { compiled } = setupApp();

    expect(compiled.querySelector('h1')?.textContent).toContain('Theme Switcher Demo');
  });

  it('should load the default theme', () => {
    const { compiled } = setupApp();

    expect(currentThemeText(compiled)).toContain('System');
    expect(document.body.classList.contains('theme-system')).toBe(true);
  });

  it('should set the theme to light when Light Mode is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Light Mode');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('Light');
    expect(document.body.classList.contains('theme-light')).toBe(true);
  });

  it('should set the theme to dark when Dark Mode is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Dark Mode');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('Dark');
    expect(document.body.classList.contains('theme-dark')).toBe(true);
  });

  it('should set the theme to system when System Mode is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Light Mode');
    fixture.detectChanges();
    clickTheme(compiled, 'System Mode');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('System');
    expect(document.body.classList.contains('theme-system')).toBe(true);
  });

  it('should save the selected theme to localStorage', () => {
    const { compiled } = setupApp();

    clickTheme(compiled, 'Dark Mode');

    expect(localStorage.getItem(storageKey)).toBe('dark');
  });

  it('should update the body class when the theme changes', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Light Mode');
    fixture.detectChanges();
    expect(document.body.classList.contains('theme-light')).toBe(true);
    expect(document.body.classList.contains('theme-system')).toBe(false);

    clickTheme(compiled, 'Dark Mode');
    fixture.detectChanges();
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(document.body.classList.contains('theme-light')).toBe(false);
  });
});
