const expect = require('chai').expect
/* eslint-disable no-undef */

module.exports = (body, status) => {
  const responseKeys = ['status', 'payload']
  expect(body)
    .to.have.all.keys(responseKeys)
  expect(body.status)
    .to.be.a('string')
    .and.to.be.equal(status)
}