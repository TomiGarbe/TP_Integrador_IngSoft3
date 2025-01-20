describe('Nombre Existente', () => {
  it('Carga correctamente la página de ejemplo', () => {
    const Url = Cypress.env('Url');
    if (!Url) {
      throw new Error('Error: Url is not defined. Please check your environment variables.');
    }
    cy.visit(Url)
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[routerlink="/user/create"]').click();
    cy.wait(500);
    cy.get('#user_name').type('Tomas');
    cy.get('#user_lastname').type('Garbellotto');
    cy.get('#user_dni').type('44828335');
    cy.get('#user_email').type('tomigarbe2003@gmail.com');
    cy.get('#user_phone').type('3516509296');
    cy.wait(500);
    cy.get('.btn-primary').click();
    cy.get('.toast-message').click();
    cy.get('.ng-trigger').should('include.text', 'Ya existe un usuario con el mismo nombre y apellido.');
    cy.wait(500);
    /* ==== End Cypress Studio ==== */
  })
})