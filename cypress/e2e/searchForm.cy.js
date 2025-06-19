describe('SearchForm Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render input with initial value', () => {
    cy.get('input.search-input').should('have.value', 'Interstellar');
  });

  it('should update input on typing', () => {
    cy.get('input.search-input')
      .clear()
      .type('Avengers')
      .should('have.value', 'Avengers');
  });

  it('should trigger popup and callback on Search button click', () => {
    cy.get('input.search-input').clear().type('Iron Man');
    cy.get('button.search-button').click();

    // Validation if popup renders text
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Search triggered for: Iron Man');
    });
  });

  it('should trigger popup and callback on Enter key', () => {
    cy.get('input.search-input').clear().type('Thor{enter}');
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Search triggered for: Thor');
    });
  });
});
