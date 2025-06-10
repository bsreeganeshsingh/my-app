describe('GenreSelect Component', () => {
    beforeEach(() => {
        cy.visit('/');
    });


    it('should render buttons for each genre', () => {
        const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
        genres.forEach(genre => {
            cy.get('button').contains(genre).should('exist');
        });
    });

    it('should highlight the selected genre button', () => {
        const selectedGenre = 'Comedy';
        cy.get('button').contains(selectedGenre).click().should('have.class', 'selected');
    });

    it('should call onSelect with genre when button is clicked', () => {
        const genreToSelect = 'Sci-Fi';
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alert');
        });
        cy.get('button').contains(genreToSelect).click();
        cy.get('@alert').should('have.been.calledWith', `Genre selected: ${genreToSelect}`);
    });

    it('should update selected genre when a new genre is clicked', () => {
        const newGenre = 'Action';
        cy.get('button').contains(newGenre).click();
        cy.get('.container').contains(`Selected Genre: ${newGenre}`).should('exist');
    });

    it('should not highlight unselected genre buttons', () => {
        const unselectedGenres = ['Comedy', 'Drama', 'Horror', 'Sci-Fi'];
        unselectedGenres.forEach(genre => {
            cy.get('button').contains(genre).should('not.have.class', 'selected');
        });
    });
});