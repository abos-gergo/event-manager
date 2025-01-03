import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import localeHu from '@angular/common/locales/hu';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeHu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      progressBar: true,
      progressAnimation: 'decreasing',
      easeTime: 150,
      timeOut: 4500,
      extendedTimeOut: 1500,
      closeButton: true,
      toastClass: 'own-toastr',
    }),
    { provide: LOCALE_ID, useValue: 'hu' },
  ],
};
