describe('Pruebas del Sitio Web Carrera', () => {
  it('Debería cargar la landing page correctamente', () => {
    // Visita la página base (http://localhost:4200)
    cy.visit('/');

    // Verifica que el contenedor o cuerpo exista
    cy.get('body').should('be.visible');
  });
});
