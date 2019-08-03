const expect = require('chai').expect
const request = require('supertest')
const { initDatabase, clearDatabase } = require('../../src/database/init-database')
const { ConfigSet } = require('../../src/database/config-set-model')
const { ConfigField } = require('../../src/database/config-field-model')
const responseTester = require('../util/response-tester')
const configFieldTester = require('../util/config-field-tester')
const { ObjectId } = require('mongoose').mongo
const status = require('../../status-codes')
const messages = require('../../src/messages')('config-field-api')


const app = require('../../src/app')


/* eslint-disable no-undef */

describe('CONTROLLER TEST : config-field:createField', () => {
  before(async () => {
    await initDatabase()
  })
  beforeEach(async () => {
    await clearDatabase()
  })
  it('bad configSetId', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${new ObjectId()}`
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ key: 'aKey', value: 'aVal' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.eql([{
      field: 'configSet',
      message: messages.wrongConfigSetId
    }])
  })
  it('full request', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${doc._id}`
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ key: 'aKey', value: 'aVal' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configFieldTester(body.payload, { key: 'aKey', value: 'aVal' })
  })
  it('empty request', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${doc._id}`
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ key: '', value: '' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.eql([{ field: 'key', message: 'Path `key` is required.' }])
  })
  it('empty key, value specified', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${doc._id}`
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ key: '', value: 'test' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.eql([{ field: 'key', message: 'Path `key` is required.' }])
  })
  it('key specified, empty value', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${doc._id}`
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ key: 'aKey', value: '' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configFieldTester(body.payload, { key: 'aKey', value: '' })
  })
  it('duplicated key, value specified', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${doc._id}`
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ key: '1', value: 'aValue' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.equal(messages.duplicated)
  })
  it('duplicated key, empty value', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${doc._id}`
    console.info(`POST ${url}`)
    const { body } = await request(app).post(url).send({ key: '1', value: '' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.equal(messages.duplicated)
  })
})

describe('CONTROLLER TEST : config-field:updateField', () => {
  before(async () => {
    await initDatabase()
  })
  beforeEach(async () => {
    await clearDatabase()
  })
  it('bad id', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${new ObjectId()}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ key: 'aKey', value: 'aVal' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.null
  })
  it('full request', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${fields[0]._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ key: 'updatedKey', value: 'updatedVal' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configFieldTester(body.payload, { key: 'updatedKey', value: 'updatedVal' })
  })
  it('empty request', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${fields[0]._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ key: '', value: '' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configFieldTester(body.payload, { key: '0', value: '0' })
  })
  it('empty key, value specified', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${fields[0]._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ key: '', value: 'updatedValue' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configFieldTester(body.payload, { key: '0', value: 'updatedValue' })
  })
  it('key specified, empty value', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${fields[0]._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ key: 'updatedKey', value: '' })
    responseTester(body, status.web.OK)
    expect(body.payload).to.be.a('Object')
    configFieldTester(body.payload, { key: 'updatedKey', value: '0' })
  })
  it('duplicated key, value specified', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${fields[0]._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ key: '1', value: 'updatedValue' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.equal(messages.duplicated)
  })
  it('duplicated key, empty value', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${fields[0]._id}`
    console.info(`PUT ${url}`)
    const { body } = await request(app).put(url).send({ key: '1', value: '' })
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.equal(messages.duplicated)
  })
})

describe('CONTROLLER TEST : config-field:deleteField', () => {
  before(async () => {
    await initDatabase()
  })
  beforeEach(async () => {
    await clearDatabase()
  })
  it('bad id', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = '/config-field/BAD_ID'
    console.info(`DELETE ${url}`)
    const { body } = await request(app).delete(url)
    responseTester(body, status.web.BAD_REQUEST)
    expect(body.payload).to.equal(messages.idNotValid)
  })
  it('wrong id', async () => {
    const doc = new ConfigSet({ name: 'Foo' })
    const fieldData = ['0', '1', '2'].map(i => ({ key: i, value: i }))
    const fields = fieldData.map(data => new ConfigField({ key: data.key, value: data.value, configSet: doc._id }))
    doc.fields = fields.map(field => field._id)
    await doc.save()
    await ConfigField.insertMany(fields)
    const url = `/config-field/${new ObjectId()}`
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
    const url = `/config-field/${fields[0]._id}`
    console.info(`DELETE ${url}`)
    const { body } = await request(app).delete(url)
    responseTester(body, status.web.OK)
    expect(body.payload).to.equal(fields[0]._id.toString())
  })
})