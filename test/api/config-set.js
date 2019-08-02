require('../../src/util/override-console-methods')
const expect = require('chai').expect
const request = require('supertest')
const { initDatabase, clearDatabase } = require('../../src/database/init-database')
const { ConfigSet } = require('../../src/database/config-set-model')

const app = require('../../src/app')

/* eslint-disable no-undef */

const testResponse = body => {
  const responseKeys = ['status', 'payload', '_links']
  expect(body)
    .to.have.all.keys(responseKeys)
  expect(body.status)
    .to.be.a('string')
    .and.not.to.be.empty
}
const testConfitSet = set => {
  const confitSetKeys = ['fields', '_id', 'name', '_links']
  const linkKeys = ['collection', 'create', 'self', 'fields', 'createField']

  expect(set)
    .to.have.all.keys(confitSetKeys)
  expect(set.fields)
    .to.be.an('Array')
  if (set.fields.length > 0) {
    //@TODO: Check fields
  }
  expect(set._id)
    .to.be.a('string')
    .and.to.have.lengthOf(24)
  expect(set.name)
    .to.be.a('string')
    .and.not.to.be.empty
  expect(set._links)
    .to.have.all.keys(linkKeys)
  linkKeys.forEach(key => expect(set._links[key])
    .to.be.a('string')
    .and.not.to.be.empty
    .and.not.to.match(/undefined/))
}

describe('GET getAll', () => {
  before(done => {
    initDatabase().then(() => done())
  })
  it('Getting all config sets - no set', async () => {
    try {
      const { body } = await request(app).get('/config')
      expect(body).to.contain.property('payload')
      expect(body.payload).to.eql([])
    }
    catch (err) {
      return err
    }
  })
  it('Getting all config sets - one set', async () => {
    await clearDatabase()
    await new ConfigSet({ name: 'Foo' }).save()
    const { body } = await request(app).get('/config')
    testResponse(body)
    expect(body.payload).to.be.an('Array').and.to.have.lengthOf(1)
    testConfitSet(body.payload[0])
  })

})




