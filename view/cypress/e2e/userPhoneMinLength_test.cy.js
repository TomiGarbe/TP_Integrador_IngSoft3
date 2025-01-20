describe('Telefono Corto', () => {
  it('Carga correctamente la página de ejemplo', () => {
    const Url = Cypress.env('Url');
    if (!Url) {
      throw new Error('Error: Url is not defined. Please check your environment variables.');
    }
    cy.visit(Url)
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[routerlink="/user/create"]').click();
    cy.wait(500);
    cy.get('#user_name').type('Tomi');
    cy.get('#user_lastname').type('Garbellotto');
    cy.get('#user_dni').type('44828334');
    cy.get('#user_email').type('tomas@gmail.com');
    cy.get('#user_phone').type('351650929');
    cy.wait(500);
    cy.get('.btn-primary').click();
    cy.get('.toast-message').click();
    cy.get('.ng-trigger').should('include.text', 'El telefono debe tener exactamente 10 numeros, no puede comenzar con 0 y no puede contener letras ni caracteres especiales.');
    cy.wait(500);
    /* ==== End Cypress Studio ==== */
  })
})