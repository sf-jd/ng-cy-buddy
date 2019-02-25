/// <reference types="Cypress" />

context('ng Todo App', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.visit('http://localhost:4200');
  });

  describe('Basic components', () => {
    it('Should see the title', () => {
      cy.get('.app-title').should('be', 'visible');
      cy.get('.app-title').should('contain', 'Todo App');
    });
    it('Should see the subtitle', () => {
      cy.get('.mobile-subheader').should('be.visible');
      cy.get('.mobile-subheader').should('contain', 'Now on mobile!');
    });
    it('Should see the Add to-do input', () => {
      cy.get('.todo-input').should('be', 'visible');
    });
    it('Should see 3 preexisting todos', () => {
      cy.get('.todo-item-left').should('be', 'visible');
      cy.get('.todo-item-left').should('have.length', 3);
    });
    it('Should see a remaining todos footer', () => {
      cy.get('.todo-footer').should('be', 'visible');
      cy.get('.todo-footer')
        .find('.remaining-todos')
        .should('contain', 'incomplete items on your list');
    });
  });

  describe('Todo structure', () => {
    it('Should display a checkbox', () => {
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.todo-checkbox')
          .should('be', 'visible');
      });
    });
    it('Should display the ToDo title', () => {
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.todo-item-label')
          .should('be', 'visible')
          .should('contain', 'todo');
      });
    });
    it('Should display a delete icon', () => {
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.delete-item')
          .should('be', 'visible');
      });
    });
    it('Should have a data-id attribute', () => {
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el).should('have.attr', 'data-id');
      });
    });
  });

  describe('Todo interactions', () => {
    it('Should create a new Todo', () => {
      cy.get('.todo-input').type('New todo{enter}');
      cy.get('.todo-item-left').should('have.length', 4);
    });
    it('Should delete a single Todo', () => {
      const todosLength = 3;
      cy.get('.todo-item-left[data-id="3"]')
        .parent()
        .find('.remove-item')
        .click();
      cy.get('.todo-item-left').should('have.length.lessThan', todosLength);
    });
    it('Should edit all todos', () => {
      //Lets edit them first
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.todo-item-label')
          .dblclick();
        cy.get('.todo-item-edit').type(' edited{enter}');
      });
      //Now lets check the value persisted
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.todo-item-label')
          .should('contain', 'edited');
      });
    });
    it('Should go out of edit mode on focus off', () => {
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.todo-item-label')
          .dblclick();
        cy.get('.todo-item-edit')
          .should('be.visible')
          .type('{esc}');
        cy.get('.todo-item-edit').should('not.be.visible');
      });
    });
    it('Should be able to cross off done Todos', () => {
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.todo-checkbox')
          .click();
        cy.wrap($el)
          .find('.todo-item-label')
          .should('have.class', 'completed');
      });
    });
    it('Should see an Add Todos messages if no Todos exist', () => {
      cy.get('.no-todos-message').should('not.exist');
      cy.get('.todo-item-left')
        .each($el => {
          cy.wrap($el)
            .parent()
            .find('.remove-item')
            .click();
        })
        .then(() => {
          cy.get('.no-todos-message').should('contain', 'Start adding some ToDos!');
        });
    });
  });

  describe('Remaining behavior', () => {
    it('Should show how many todos exist', () => {
      cy.get('.remaining-count').should($count => {
        const count = $count.text();
        expect(count).to.match(/3/);
      });
    });
    it('Should substract one when a todo is deleted', () => {
      cy.get('.todo-item-left[data-id="3"]')
        .parent()
        .find('.remove-item')
        .click();
      cy.get('.remaining-count').should($count => {
        const count = $count.text();
        expect(count).to.match(/2/);
      });
    });
    it('Should add one when a Todo is created', () => {
      cy.get('.todo-input').type('New todo{enter}');
      cy.get('.remaining-count').should($count => {
        const count = $count.text();
        expect(count).to.match(/4/);
      });
    });
    it('Should remain the same when a Todo is edited', () => {
      cy.get('.todo-item-left').each($el => {
        cy.wrap($el)
          .find('.todo-item-label')
          .dblclick();
        cy.get('.todo-item-edit').type(' edited{enter}');
        cy.get('.remaining-count').should($count => {
          const count = $count.text();
          expect(count).to.match(/3/);
        });
      });
    });
    it('Should substract one when a Todo is completed', () => {
      cy.get('.todo-item-left[data-id="3"]')
        .find('.todo-checkbox')
        .click();
      cy.get('.remaining-count').should($count => {
        const count = $count.text();
        expect(count).to.match(/2/);
      });
    });
    it('Should add one when a Todo is unchecked', () => {
      cy.get('.todo-item-left[data-id="3"]')
        .find('.todo-checkbox')
        .click();
      cy.get('.remaining-count').should($count => {
        const count = $count.text();
        expect(count).to.match(/2/);
      });
      cy.get('.todo-item-left[data-id="3"]')
        .find('.todo-checkbox')
        .click();
      cy.get('.remaining-count').should($count => {
        const count = $count.text();
        expect(count).to.match(/3/);
      });
    });
  });
});
