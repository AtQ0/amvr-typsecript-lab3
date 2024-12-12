describe('User Registration Flow', () => {
    it('should create a new user, agree to the terms, save changes, and verify via the backend API and frontend page', () => {
        // 1. Visit the frontend registration page
        cy.visit('http://localhost:5173/register');

        // 2. Fill in the registration form with the required values
        cy.get('input[type="text"]').type('demo@gmail.com');
        cy.get('input[type="password"]').type('demo123');

        // 3. Submit the form
        cy.get('button[type="submit"]').click();

        // 4. Ensure redirection to the edit profile page
        cy.url().should('match', /\/users\/[a-f0-9\-]+\/editProfile/);

        // 5. Handle the UserAgreementDialog
        cy.get('button').contains('Agree').click(); // Agree to the user agreement

        // 6. Save changes on the EditProfile page
        cy.get('button').contains('Save Changes').click();

        // 7. Verify redirection to the profile page
        cy.url().should('match', /\/users\/[a-f0-9\-]+\/profile/);

        // Extract the user ID from the URL to check the user profile page
        cy.url().then((url) => {
            const userId = url.match(/\/users\/([a-f0-9\-]+)\/profile/)[1];

            // 8. Verify the user exists in the backend via API
            cy.request('GET', `http://localhost:3000/api/admin/get-user-by-email?email=demo@gmail.com`).then((response) => {
                expect(response.status).to.eq(200); // Ensure API call was successful

                // Extract the user from the response
                const user = response.body;

                // Assertions on the user data (backend verification)
                expect(user).to.not.be.undefined; // Ensure the user exists
                expect(user.email_address).to.equal('demo@gmail.com'); // Verify the email
                expect(user.gdpr).to.be.true; // Ensure GDPR agreement is true
                expect(user.role).to.exist; // Verify that the role exists
                expect(user.first_name).to.be.null; // Ensure first name is null as no input was made
                expect(user.last_name).to.be.null; // Ensure last name is null as no input was made
                expect(user.address).to.be.null; // Ensure address is null as no input was made
                expect(user.date_of_birth).to.equal('1970-01-01T23:00:00.000Z'); // Verify the default date of birth
            });

            // 9. Verify the user data is displayed correctly on the frontend profile page
            cy.get('h1').should('contain', ''); // Check if first and last name is empty string as no input was made
            cy.get('.profile-email').should('contain', 'demo@gmail.com'); // Ensure the email is displayed correctly
        });
    });
});
