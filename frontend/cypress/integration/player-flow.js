describe('Game Flow', () => {
  it('Create game', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-testid=create-game]').click();
    cy.get('[data-testid=enter-your-name]').click();
    cy.get('[data-testid=enter-your-name]').type('Kiro');
    cy.get('[data-testid=enter-game-name').type('Test game1');
    cy.get('[data-testid=slider]').click();
    cy.get('[data-testid=private]').click();
    cy.get('[data-testid=password]').type('password');
    cy.get('[data-testid=create-game-final').click();

    cy.url().should('include', '/game/');
    cy.get('[data-testid=lobby-title]').contains('Test game1');

    cy.get('[data-testid="start-game"]').click();
    cy.get('[data-testid="timer"]').should('be.visible');
    cy.get('[data-testid="pictobear"]').click();
  });

  it('Join game', async () => {
    console.log(process.env.CLEAR_KEY);
    await fetch('http://localhost:3001/clear-games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    cy.visit('http://localhost:3000');
    const gameObj = {
      creator: 'id',
      type: 'Private',
      name: 'Test game2',
      maxPlayers: 6,
      password: 'password',
      players: [
        {
          id: 'id',
          name: 'Kiro',
        },
      ],
      status: 'lobby',
    };
    fetch('http://localhost:3001/create-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameObj),
    });

    cy.get('[data-testid="room-card"]').click();
    cy.get('[data-testid="enter-join-name"]').type('Kiro2');
    cy.get('[data-testid="join-game-final"]').click();
    cy.get('[data-testid="password"]').should('be.visible');
    cy.get('[data-testid="password"]').click().type('wrong');
    cy.get('[data-testid="incorrect-password"]').should('be.visible');
    cy.url().should('not.contain', '/game');
    cy.get('[data-testid="password"]').clear().type('password');
    cy.get('[data-testid="join-game-final"]').click();

    cy.url().should('include', '/game/id');
    cy.get('[data-testid="start-game"]').should('not.exist');
    cy.get('[data-testid="lobby-title"]').should('be.visible');
    cy.get('[data-testid="copy-invite-link"]').should('be.visible');
    cy.get('[data-testid="host"]').should('be.visible');
    cy.get('[data-testid="pictobear"]').click();
    cy.get('[data-testid="room-card"]').should('be.visible');
  });
});
