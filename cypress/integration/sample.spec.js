describe('Sample Test', () => {
    it('should be ok', () => {
      expect(true).to.equal(true)
    })
})

describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
      cy.visit('https://example.cypress.io')
    })

    it('finds the content "type"', () => {
        cy.visit('https://example.cypress.io')
    
        cy.contains('type')
    })

    it('clicks the link "type"', function() {
        cy.visit('https://example.cypress.io')
    
        cy.contains('type').click()
        cy.url().should('include', '/commands/actions')

        cy.get('.action-email')
            .type('fake@email.com')
            .should('have.value', 'fakie@email.com')
    })
})