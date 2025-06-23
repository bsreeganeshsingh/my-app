describe('GenreSelect Component', () => {
    beforeEach(() => {
        cy.visit('/');
    });


    it('should render buttons for each genre', () => {
        const genres = ['ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCI-FI'];
        genres.forEach(genre => {
            cy.get('button').contains(genre).should('exist');
        });
    });

    it('should highlight the selected genre button', () => {
        const selectedGenre = 'COMEDY';
        cy.get('button').contains(selectedGenre).click().should('have.class', 'selected');
    });

    it('should call onSelect with genre when button is clicked', () => {
        const genreToSelect = 'SCI-FI';
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alert');
        });
        cy.get('button').contains(genreToSelect).click();
        cy.get('@alert').should('have.been.calledWith', `Genre selected: ${genreToSelect}`);
    });

    it('should not highlight unselected genre buttons', () => {
        const unselectedGenres = ['COMEDY', 'DRAMA', 'HORROR', 'SCI-FI'];
        unselectedGenres.forEach(genre => {
            cy.get('button').contains(genre).should('not.have.class', 'selected');
        });
    });
});