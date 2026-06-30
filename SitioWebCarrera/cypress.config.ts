import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Aquí van los plugins adicionales si los necesitas
    },
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false, // 👈 AGREGA ESTA LÍNEA AQUÍ
  },
  // CONFIGURACIÓN CLAVE PARA JIRA:
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'test-results/cypress-junit-[hash].xml',
    toConsole: true,
  },
});
