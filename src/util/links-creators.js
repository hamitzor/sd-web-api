const { rootAddress } = require('./address')
const config = require('../../app.config')


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
  [doc.session ? 'session' : '']: doc.session ? addUserSessionLinks(doc.session) : doc.session,
  _links: {
    collection: `${rootAddress}/user`,
    create: `${rootAddress}/user`,
    self: `${rootAddress}/user/${doc._id}`,
    deleteAvatar: `${rootAddress}/user/${doc._id}/avatar`,
    changeRole: `${rootAddress}/user/${doc._id}/role`
  }
})
const addUserSessionLinks = doc => ({
  ...doc,
  _links: {
    collection: `${rootAddress}/user-session`,
    create: `${rootAddress}/user-session`,
    self: `${rootAddress}/user-session/${doc._id}`,
    withCookie: `${rootAddress}/user-session/with-cookie`
  }
})
const createAvatarLink = filename => `${rootAddress}/static/${config.storage.avatars}/${filename}`

module.exports = { addFieldLinks, addConfigLinks, addUserLinks, addUserSessionLinks, createAvatarLink }