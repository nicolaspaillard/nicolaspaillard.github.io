import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { mergeApplicationConfig } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { getStorage, provideStorage } from "@angular/fire/storage";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppComponent, firebaseConfig, routes } from "./app/app.component";
import { Matrix } from "./matrix";

bootstrapApplication(
  AppComponent,
  mergeApplicationConfig(
    {
      providers: [
        provideRouter(
          routes,
          withComponentInputBinding(),
          withInMemoryScrolling({
            scrollPositionRestoration: "enabled",
            anchorScrolling: "enabled",
          }),
        ),
        provideHttpClient(withInterceptorsFromDi()),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        provideAuth(() => getAuth()),
        ConfirmationService,
        MessageService,
      ],
    },
    Matrix,
  ),
).catch((err) => console.error(err));
