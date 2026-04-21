import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle shadow-sm hover:bg-base-200 transition-all duration-300">
        <div class="flex items-center justify-center text-xl">
          {{ currentFlag }}
        </div>
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow-xl border border-base-200 backdrop-blur-md bg-opacity-90">
        <li *ngFor="let lang of languages">
          <button (click)="changeLanguage(lang.code)" class="flex items-center gap-3 hover:bg-primary hover:text-primary-content transition-colors duration-200 py-2">
            <span class="text-xl">{{ lang.flag }}</span>
            <span class="font-medium">{{ lang.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  `
})
export class LanguageSelectorComponent {
  private translate = inject(TranslateService);

  languages: { code: string, name: string, flag: string }[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  get currentFlag(): string {
    const currentLang = this.translate.currentLang || 'es';
    return this.languages.find(l => l.code === currentLang)?.flag || '🇪🇸';
  }

  constructor() {
    // Inicializar el idioma desde localStorage o el navegador
    const savedLang = localStorage.getItem('app_lang') || 'es';
    this.translate.use(savedLang);
  }

  changeLanguage(code: string) {
    this.translate.use(code);
    localStorage.setItem('app_lang', code);
    // Forzar el cierre del dropdown quitando el foco
    (document.activeElement as HTMLElement)?.blur();
  }
}
