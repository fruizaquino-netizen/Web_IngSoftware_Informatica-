module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter') // Reportero que instalaste por comando
    ],
    client: {
      clearContext: false // deja visible la salida del Test Runner en el navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // remueve los logs duplicados
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/idssi-sitio-web'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    // CONFIGURACIÓN CLAVE PARA JIRA:
    junitReporter: {
      outputDir: './test-results', // Carpeta donde se guardará
      outputFile: 'karma-junit.xml', // Nombre del archivo de resultados
      useBrowserName: false // Evita que agregue nombres de navegadores al archivo
    },
    reporters: ['progress', 'kjhtml', 'junit'], // Añadimos 'junit' aquí
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'], // Ideal para pipelines, corre sin abrir ventana del navegador
    singleRun: true, // Se apaga al terminar las pruebas para que continúe el pipeline
    restartOnFileChange: true
  });
};
