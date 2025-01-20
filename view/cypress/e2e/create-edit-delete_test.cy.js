describe('Crear Editar Eliminar Usuario', () => {
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
      cy.get('#user_email').type('tomi@gmail.com');
      cy.get('#user_phone').type('3516509290');
      cy.wait(500);
      cy.get('.btn-primary').click();
      cy.get('.toast-message').click();
      cy.get('.ng-trigger').should('include.text', 'Usuario creado correctamente!');
      cy.wait(500);
      cy.get('tr:last-child > :nth-child(7) > .btn-primary > .fa').click();
      cy.wait(500);
      cy.get('#user_lastname').clear();
      cy.get('#user_lastname').type('Garbe');
      cy.wait(500);
      cy.get('.btn-primary').click();
      cy.get('.toast-message').click();
      cy.get('.ng-trigger').should('include.text', 'Usuario editado correctamente!');
      cy.wait(500);
      cy.get('tr:last-child > :nth-child(7) > .btn-danger > .fa').click();
      cy.wait(500);
      cy.get('.btn-danger').click();
      cy.get('.toast-message').click();
      cy.get('.ng-trigger').should('include.text', 'Usuario borrado correctamente!');
      cy.wait(500);
      /* ==== End Cypress Studio ==== */
    })
  })