describe('Counter Component', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should render initial count', () => {
        cy.get('.value').should('contain', 'Count: 10');
    });

    it('should increment count when + button is clicked', () => {
        cy.get('.button').contains('+').click();
        cy.get('.value').should('contain', 'Count: 11');
    });

    it('should decrement count when - button is clicked', () => {
        cy.get('.button').contains('-').click();
        cy.get('.value').should('contain', 'Count: 9');
    });

    it('should not decrement below zero', () => {
        // Assuming initial value is 9, clicking - button 11 times
        for (let i = 0; i < 11; i++) {
            cy.get('.button').contains('-').click();
        }
        cy.get('.value').should('contain', 'Count: 0'); // Should not go below zero
    });

    it('should increment count multiple times', () => {
        cy.get('.button').contains('+').click();
        cy.get('.button').contains('+').click();
        cy.get('.value').should('contain', 'Count: 12'); // Assuming initial value is 10
    });

    it('should decrement count multiple times', () => {
        cy.get('.button').contains('-').click();
        cy.get('.button').contains('-').click();
        cy.get('.value').should('contain', 'Count: 8'); // Assuming initial value is 10
    });
});
