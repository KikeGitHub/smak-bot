import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { CHAT_WIDGET_REPOSITORY_PORT } from './ports/chat-widget.repository.port';
import { ChatHttpAdapter } from './adapters/chat-http.adapter';
import { ChatLocalStorageAdapter } from './adapters/chat-localstorage.adapter';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),

    // Inyección de Dependencias del Patrón Bridge Dual (SDOP Framework)
    {
      provide: CHAT_WIDGET_REPOSITORY_PORT,
      useFactory: (http: HttpClient) => {
        return environment.useMockData
          ? new ChatLocalStorageAdapter()
          : new ChatHttpAdapter(http, environment.apiBaseUrl);
      },
      deps: [HttpClient]
    }
  ]
};
