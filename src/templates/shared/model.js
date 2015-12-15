
export default options =>
`import _ from 'lodash' // eslint-disable-line
import moment from 'moment'
import Backbone from 'backbone'

const db_url = process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL
if (!db_url) console.log('Missing process.env.DATABASE_URL')

export default class ${options.class_name} extends Backbone.Model {
  schema = () => _.extend({

  }, require('./schemas/${options.name}'))

  defaults() { return {created_at: moment.utc().toDate()} }
}

${options.class_name}.prototype.urlRoot = '/api/${options.plural}'
${options.class_name}.prototype.sync = require('backbone-http').sync(${options.class_name})
`
