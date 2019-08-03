const expect = require('chai').expect
const escapeForRegex = require('../../src/util/escape-for-regex')
const { rootAddress } = require('../../src/util/address')
/* eslint-disable no-undef */

module.exports = (actual, expected) => {
  const keys = ['_id', 'key', 'value', 'configSet', '_links']
  const linkKeys = ['self']

  expect(actual)
    .to.have.all.keys(keys)
  expect(actual._id)
    .to.match(/^.{24}$/)
  expect(actual.key)
    .to.equal(expected.key)
  expect(actual.value)
    .to.equal(expected.value)
  expect(actual.configSet)
    .to.match(/^.{24}$/)
  expect(actual._links)
    .to.have.all.keys(linkKeys)
  expect(actual._links.self).to.match(new RegExp('^' + escapeForRegex(rootAddress + '/config-field/') + '.{24}$'))
}