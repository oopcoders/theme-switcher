import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  const modeStorageKey = 'theme-switcher-mode';
  const colorStorageKey = 'theme-switcher-color';
  const modeClasses = ['theme-light', 'theme-dark', 'theme-system'];
  const colorClasses = ['theme-blue', 'theme-red', 'theme-green'];

  beforeEach(async () => {
    localStorage.clear();
    document.body.classList.remove(...modeClasses, ...colorClasses);

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove(...modeClasses, ...colorClasses);
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

    expect(currentThemeText(compiled)).toContain('System Blue');
    expect(document.body.classList.contains('theme-system')).toBe(true);
    expect(document.body.classList.contains('theme-blue')).toBe(true);
  });

  it('should set the mode to light when Light Mode is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Light Mode');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('Light Blue');
    expect(document.body.classList.contains('theme-light')).toBe(true);
  });

  it('should set the mode to dark when Dark Mode is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Dark Mode');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('Dark Blue');
    expect(document.body.classList.contains('theme-dark')).toBe(true);
  });

  it('should set the mode to system when System Mode is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Light Mode');
    fixture.detectChanges();
    clickTheme(compiled, 'System Mode');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('System Blue');
    expect(document.body.classList.contains('theme-system')).toBe(true);
  });

  it('should set the color to red when Red is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Red');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('System Red');
    expect(document.body.classList.contains('theme-red')).toBe(true);
    expect(document.body.classList.contains('theme-blue')).toBe(false);
  });

  it('should set the color to green when Green is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Green');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('System Green');
    expect(document.body.classList.contains('theme-green')).toBe(true);
    expect(document.body.classList.contains('theme-blue')).toBe(false);
  });

  it('should set the color to blue when Blue is clicked', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Red');
    fixture.detectChanges();
    clickTheme(compiled, 'Blue');
    fixture.detectChanges();

    expect(currentThemeText(compiled)).toContain('System Blue');
    expect(document.body.classList.contains('theme-blue')).toBe(true);
    expect(document.body.classList.contains('theme-red')).toBe(false);
  });

  it('should save the selected mode to localStorage', () => {
    const { compiled } = setupApp();

    clickTheme(compiled, 'Dark Mode');

    expect(localStorage.getItem(modeStorageKey)).toBe('dark');
  });

  it('should save the selected color to localStorage', () => {
    const { compiled } = setupApp();

    clickTheme(compiled, 'Green');

    expect(localStorage.getItem(colorStorageKey)).toBe('green');
  });

  it('should load saved mode and color from localStorage', () => {
    localStorage.setItem(modeStorageKey, 'dark');
    localStorage.setItem(colorStorageKey, 'red');

    const { compiled } = setupApp();

    expect(currentThemeText(compiled)).toContain('Dark Red');
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(document.body.classList.contains('theme-red')).toBe(true);
  });

  it('should update the body classes when the theme changes', () => {
    const { compiled, fixture } = setupApp();

    clickTheme(compiled, 'Light Mode');
    fixture.detectChanges();
    expect(document.body.classList.contains('theme-light')).toBe(true);
    expect(document.body.classList.contains('theme-system')).toBe(false);

    clickTheme(compiled, 'Dark Mode');
    fixture.detectChanges();
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(document.body.classList.contains('theme-light')).toBe(false);

    clickTheme(compiled, 'Green');
    fixture.detectChanges();
    expect(document.body.classList.contains('theme-green')).toBe(true);
    expect(document.body.classList.contains('theme-blue')).toBe(false);
  });
});
