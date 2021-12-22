describe('My First Test', () => {
  it('Create game', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-testid=create-game]').click()
    cy.get('[data-testid=enter-your-name]').click()
    cy.get('[data-testid=enter-your-name]').type('Kiro')
    cy.get('[data-testid=enter-game-name').click().type('Test game')
    cy.get('[data-testid=slider]').click()
    cy.get('[data-testid=private]').click()
    cy.get('[data-testid=password]').click().type('password')
    cy.get('[data-testid=create-game-final').click()

    cy.url().should('include', '/game/')
    cy.get('[data-testid=lobby-title]').contains('Test game')

    cy.get('[data-testid="start-game"]').click()
  });
});
