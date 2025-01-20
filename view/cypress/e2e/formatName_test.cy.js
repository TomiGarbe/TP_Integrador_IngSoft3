describe('Formato Nombre', () => {
    it('Carga correctamente la página de ejemplo', () => {
      const Url = Cypress.env('Url');
      if (!Url) {
        throw new Error('Error: Url is not defined. Please check your environment variables.');
      }
      cy.visit(Url)
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[routerlink="/user/create"]').click();
      cy.wait(500);
      cy.get('#user_name').type('tOmI');
      cy.get('#user_lastname').type('gARBellOTTO');
      cy.get('#user_dni').type('44828334');
      cy.get('#user_email').type('tomi@gmail.com');
      cy.get('#user_phone').type('3516509290');
      cy.wait(500);
      cy.get('.btn-primary').click();
      cy.wait(500);
      cy.get('tr:last-child > :nth-child(2)').should('have.text', 'NameTomi');
      cy.get('tr:last-child > :nth-child(3)').should('have.text', 'LastnameGarbellotto');
      cy.get('tr:last-child > :nth-child(7) > .btn-danger > .fa').click();
      cy.wait(500);
      cy.get('.btn-danger').click();
      cy.wait(500);
      /* ==== End Cypress Studio ==== */
    })
  })