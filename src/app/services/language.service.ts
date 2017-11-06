import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LanguageService {

  languageChanged: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  getSupportedLanguages()
  {
      const supportedLanguage = [
          {
              'code': 'en',
              'name': 'English'
          },
          {
              'code': 'de',
              'name': 'German'
          },
          {
              'code': 'fr',
              'name': 'French'
          },
          {
              'code': 'nl',
              'name': 'Dutch'
          }
      ];

    return supportedLanguage;
  }

  setLanguage(language)
  {
      localStorage.setItem('lang', JSON.stringify(language));
      this.languageChanged.next(true);
  }

}
