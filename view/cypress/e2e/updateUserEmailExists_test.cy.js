describe('Correo Electronico Existente', () => {
  it('Carga correctamente la página de ejemplo', () => {
    const Url = Cypress.env('Url');
    if (!Url) {
      throw new Error('Error: Url is not defined. Please check your environment variables.');
    }
    cy.visit(Url)
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > :nth-child(7) > .btn-primary > .fa').click();
    cy.wait(500);
    cy.get('#user_email').clear();
    cy.get('#user_email').type('abc@gmail.com');
    cy.wait(500);
    cy.get('.btn-primary').click();
    cy.get('.toast-message').click();
    cy.get('.ng-trigger').should('include.text', 'El correo electronico ya esta asociado a un usuario.');
    cy.wait(500);
    /* ==== End Cypress Studio ==== */
  })
})