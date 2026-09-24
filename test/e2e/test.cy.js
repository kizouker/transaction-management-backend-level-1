// DO NOT CHANGE THIS FILE!

const apiUrl = `${Cypress.env("apiUrl")}`

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

describe('Transaction Management Backend - Level 1', () => {

  it('Provides a functional healthcheck', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/ping`,
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Can create and read transactions and accounts with positive amounts', () => {
    const accountId = uuid()
    let transactionId
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        account_id: accountId,
        amount: 7
      }
    }).then((response) => {
      assert.equal(response.status, 201, "Creating a transaction should result with 201 status code")
      assert.isDefined(response.body.transaction_id, "A transaction id should be returned")
      transactionId = response.body.transaction_id
      cy.request({
        failOnStatusCode: false,
        method: 'GET',
        url: `${apiUrl}/transactions/${transactionId}`,
      }).then((response) => {
        assert.equal(response.status, 200, "Getting an existing transaction by its id should give 200 status code")
        assert.equal(response.body.transaction_id, transactionId, "Got a transaction of a different id than queried for")
        assert.equal(response.body.account_id, accountId, "Account different than expected")
        assert.equal(response.body.amount, 7, "Got unexpected transaction amount value")
      })
    }).request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    }).then((response) => {
      assert.equal(response.status, 200, "Getting existing transaction should return 200 OK")
      assert.equal(response.body.account_id, accountId, "Got unexpected account_id value")
      assert.equal(response.body.balance, 7, "Incorrect account balance returned")
    })
  })

  it('Can create and read transactions and accounts with negative amounts', () => {
    const accountId = uuid()
    let transactionId

    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: accountId,
        amount: 4
      }
    }).then((response) => {
      assert.equal(response.status, 201, "Creating a transation should result with 201 status code")
      assert.isDefined(response.body.transaction_id, "A transaction id must be returned")
      transactionId = response.body.transaction_id
    }).request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    }).then((response) => {
      assert.equal(response.status, 200, "Getting existing account should give 200 OK")
      assert.equal(response.body.account_id, accountId, "Got unexpected account_id value")
      assert.equal(response.body.balance, 4, "Incorrect account balance returned")
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: accountId,
        amount: -3
      }
    }).then((response) => {
      assert.equal(response.status, 201, "Creating a transation should result with 201 status code")
      assert.isDefined(response.body.transaction_id, "A transaction id must be returned")
      transactionId = response.body.transaction_id
    }).request({ // read account balance
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    }).then((response) => {
      assert.equal(response.status, 200, "Getting existing account should give 200 OK")
      assert.equal(response.body.account_id, accountId, "Got unexpected account_id value")
      assert.equal(response.body.balance, 1, "Incorrect account balance returned")
    })
  })

  it('Can read all created transactions', () => {
    const firstAccountId = uuid()
    let firstTransactionId
    const secondAccountId = uuid()
    let secondTransactionId

    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: firstAccountId,
        amount: 2
      }
    }).then((response) => {
      assert.equal(response.status, 201, "Creating a transation should result with 201 status code")
      assert.isDefined(response.body.transaction_id, "A transaction id must be returned")
      firstTransactionId = response.body.transaction_id
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: secondAccountId,
        amount: 3
      }
    }).then((response) => {
      assert.equal(response.status, 201, "Creating a transation should result with 201 status code")
      assert.isDefined(response.body.transaction_id, "A transaction id must be returned")
      secondTransactionId = response.body.transaction_id
    }).request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${firstAccountId}`,
    }).then((response) => {
      assert.equal(response.status, 200, "Getting existing account should give 200 OK")
      assert.equal(response.body.account_id, firstAccountId, "Got unexpected account_id value")
      assert.equal(response.body.balance, 2, "Incorrect account balance returned")
    }).request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${secondAccountId}`,
    }).then((response) => {
      assert.equal(response.status, 200, "Getting existing account should give 200 OK")
      assert.equal(response.body.account_id, secondAccountId, "Got unexpected account_id value")
      assert.equal(response.body.balance, 3, "Incorrect account balance returned")
    }).request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/transactions`,
    }).then((response) => {
      assert.equal(response.status, 200, "Getting existing account should give 200 OK")
      assert(response.body.length >= 2, "Got unexpected number of transations")
      assert(response.body.some(elem => elem. account_id == firstAccountId
        && elem.transaction_id == firstTransactionId && elem.amount == 2, "First transation not found"))
      assert(response.body.some(elem => elem.account_id == secondAccountId
        && elem.transaction_id == secondTransactionId && elem.amount == 3, "Second transation not found"))
    })
  })

  it('Can handle requests for non-existent accounts and transactions', () => {
    const accountId = uuid()
    const transactionId = uuid()

    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    }).then((response) => {
      assert.equal(response.status, 404, "Reading an inexistent account should return 404")
    }).request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/transactions/${transactionId}`,
    }).then((response) => {
      assert.equal(response.status, 404, "Reading an inexistent transaction should return 404")
    })
  })

  it('Can handle invalid requests', () => {
    const accountId = uuid()
    cy.request({
      failOnStatusCode: false,
      method: 'PUT', // wrong method
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: accountId,
        amount: 10
      }
    }).then((response) => {
      assert.equal(response.status, 405, "Method not allowed status code should be returned when using a wrong HTTP method")
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/xml", // wrong Content-Type
      },
      body: {
        account_id: accountId,
        amount: 10
      }
    }).then((response) => {
      assert.equal(response.status, 415, "Incorrect content-type should be returned when passing a wrong Content-Type header")
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: { // missing account_id
        amount: 7
      }
    }).then((response) => {
      assert.equal(response.status, 400, "Bad request status code should be returned in case of missing account_id")
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: { // missing amount
        account_id: accountId
      }
    }).then((response) => {
      assert.equal(response.status, 400, "Bad request status code should be returned in case of missing amount")
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: 10, // bad format
        amount: 7
      }
    }).then((response) => {
      assert.equal(response.status, 400, "Bad request status code should be returned in case of malformed transaction id")
    })
  })

})
