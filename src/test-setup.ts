import '@angular/compiler'; // 🌟 CRÍTICO: Registra el compilador JIT antes de nada
import 'zone.js';
import 'zone.js/testing';
import '@analogjs/vite-plugin-angular/setup-vitest'; // Carga los parches de zona de Analog

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Forzamos la inicialización manual por si la automática de Analog no se activó
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);