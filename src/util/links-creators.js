const { rootAddress } = require('./address')

const addFieldLinks = field => ({ ...field, _links: ({ self: `${rootAddress}/config-field/${field._id}` }) })

const addConfigLinks = doc => ({
  ...doc,
  fields: doc.fields.map(field => addFieldLinks(field)),
  _links: ({
    collection: `${rootAddress}/config`,
    create: `${rootAddress}/config`,
    self: `${rootAddress}/config/${doc._id}`,
    createField: `${rootAddress}/config-field/${doc._id}`
  })
})

const addUserLinks = doc => ({
  ...doc,
  _links: {
    someLink: 'Link'
  }
})

const addUserSessionLinks = doc => ({
  ...doc,
  _links: {
    sessonLink: 'Link'
  }
})

module.exports = { addFieldLinks, addConfigLinks, addUserLinks, addUserSessionLinks }