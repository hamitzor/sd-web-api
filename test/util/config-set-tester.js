const expect = require('chai').expect
const escapeForRegex = require('../../src/util/escape-for-regex')
const { rootAddress } = require('../../src/util/address')
const configFieldTester = require('./config-field-tester')
/* eslint-disable no-undef */

module.exports = (actual, expected, expectedFields = []) => {
  const keys = ['fields', '_id', 'name', '_links']
  const linkKeys = ['collection', 'create', 'self', 'createField']

  expect(actual)
    .to.have.all.keys(keys)
  expect(actual.fields)
    .to.be.an('Array')
  expect(actual._id)
    .to.match(/^.{24}$/)
  expect(actual.name)
    .to.equal(expected.name)
  expect(actual._links)
    .to.have.all.keys(linkKeys)
  expect(actual._links.collection).to.eql(`${rootAddress}/config`)
  expect(actual._links.create).to.eql(`${rootAddress}/config`)
  expect(actual._links.self).to.match(new RegExp('^' + escapeForRegex(rootAddress + '/config/') + '.{24}$'))
  expect(actual._links.createField).to.match(new RegExp('^' + escapeForRegex(rootAddress + '/config-field/') + '.{24}$'))
  expect(actual.fields).to.have.lengthOf(expectedFields.length)
  actual.fields.forEach((field, i) => configFieldTester(field, expectedFields[i]))
}