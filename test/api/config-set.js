const expect = require('chai').expect
const request = require('supertest')
const { initDatabase, clearDatabase } = require('../../src/database/init-database')
const { ConfigSet } = require('../../src/database/config-set-model')
const { ConfigField } = require('../../src/database/config-field-model')
const responseTester = require('../util/response-tester')
const configSetTester = require('../util/config-set-tester')
const { ObjectId } = require('mongoose').mongo
const status = require('../../status-codes')
const messages = require('../../src/messages')('config-set-api')


const app = require('../../src/app')


/* eslint-disable no-undef */

describe('CONTROLLER TEST : config-set:getAll', () => {
  before(async () => {
    await initDatabase()
  })
  beforeEach(async () => {
    await clearDatabase()
  })

  it('no set', async () => {
    const url = '/config'
    console.info(`GET ${url}`)
    const { body } = await request(app).get(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.eql([])
  })
  it('one set', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = '/config'
    console.info(`GET ${url}`)
    const { body } = await request(app).get(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.an('Array').and.to.have.lengthOf(1)
    configSetTester(body.payload[0], { name: doc.name }, fieldData)
  })
  it('multiple sets', async () => {
    const docCount = 5
    const docs = Array.from(Array(docCount).keys()).map(i => new ConfigSet({ name: i }))
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    for (const doc of docs) {
      const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
      doc.fields = fields.map(field => field._id)
      await doc.save()
      await ConfigField.insertMany(fields)
    }
    const url = '/config'
    console.info(`GET ${url}`)
    const { body } = await request(app).get(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.an('Array').and.to.have.lengthOf(docCount)
    body.payload.forEach(o => configSetTester(o, { name: o.name }, fieldData))
  })
})

describe('CONTROLLER TEST : config-set:get', () => {
  beforeEach(async () => {
    await clearDatabase()
  })
  it('bad id', async () => {
    const url = '/config/BAD_ID'
    console.info(`GET ${url}`)
    const { body } = await request(app).get(url)
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.equal(messages.idNotValid)
  })
  it('wrong id', async () => {
    const url = `/config/${new ObjectId()}`
    console.info(`GET ${url}`)
    const { body } = await request(app).get(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.null
  })
  it('one set', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config/${doc._id}`
    console.info(`GET ${url}`)
    const { body } = await request(app).get(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.an('Object')
    configSetTester(body.payload, { name: doc.name }, fieldData)
  })
})

describe('CONTROLLER TEST : config-set:create', () => {
  beforeEach(async () => {
    await clearDatabase()
  })
  it('good request', async () => {
    const url = '/config'
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ name: 'Test' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configSetTester(body.payload, { name: 'Test' })
  })
  it('name empty', async () => {
    const url = '/config'
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ name: '' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.eql([{ field: 'name', message: 'Path `name` is required.' }])
  })
  it('name undefined', async () => {
    const url = '/config'
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({})
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.eql([{ field: 'name', message: 'Path `name` is required.' }])
  })
})

describe('CONTROLLER TEST : config-set:update', () => {
  beforeEach(async () => {
    await clearDatabase()
  })
  it('good request', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config/${doc._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ name: 'Updated' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configSetTester(body.payload, { name: 'Updated' }, fieldData)
  })
  it('name empty', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config/${doc._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ name: '' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configSetTester(body.payload, { name: 'Foo' }, fieldData)
  })
  it('wrong id', async () => {
    const url = `/config/${new ObjectId()}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({})
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.null
  })
})

describe('CONTROLLER TEST : config-set:delete', () => {
  beforeEach(async () => {
    await clearDatabase()
  })
  it('bad id', async () => {
    const url = '/config/BAD_ID'
    console.info(`DELETE ${url}`)
    const { body } = await request(app).delete(url)
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.equal(messages.idNotValid)
  })
  it('wrong id', async () => {
    const url = `/config/${new ObjectId()}`
    console.info(`DELETE ${url}`)
    const { body } = await request(app).delete(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.null
  })
  it('good id', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config/${doc._id}`
    console.info(`DELETE ${url}`)
    const { body } = await request(app).delete(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.eql(doc._id.toString())
  })
})