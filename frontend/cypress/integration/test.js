describe('Player Flow', () => {
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
    cy.get('[data-testid="timer"]').should('be.visible')
    cy.get('[data-testid="pictobear"]').click()
  });

  it('Join game', async() => {
    const gameObj = {
      creator: 'id',
      type: 'private',
      name: 'Test game',
      maxPlayers: 6,
      password: 'password',
      players: [
        {
          id: 'id',
          name: 'Kiro'
        }
      ],
      status: 'lobby'
    };
    await fetch('http://localhost:3001/create-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameObj),
    });

    cy.get('[data-testid="enter-join-name"]').click().type('Kiro2')
    cy.get('[data-testid="join-game-final"]').click()

    cy.url().should('include', '/game/')
    cy.get('[data-testid="start-game"]').should('not.exist')
    cy.get('[data-testid="lobby-title"]').should('be.visible')

  });
});
