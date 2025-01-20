describe('Correo Electronico Existente', () => {
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
    cy.get('#user_email').type('tomigarbe2003@gmail.com');
    cy.get('#user_phone').type('3516509296');
    cy.wait(500);
    cy.get('.btn-primary').click();
    cy.get('.toast-message').click();
    cy.get('.ng-trigger').should('include.text', 'El correo electronico ya esta asociado a un usuario.');
    cy.wait(500);
    /* ==== End Cypress Studio ==== */
  })
})