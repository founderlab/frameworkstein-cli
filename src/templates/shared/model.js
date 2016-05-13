
export default options =>
`import _ from 'lodash' // eslint-disable-line
import moment from 'moment'
import Backbone from 'backbone'

export default class ${options.className} extends Backbone.Model {
  schema = () => _.extend({

  }, require('./schemas/${options.name}'))

  defaults() { return {created_at: moment.utc().toDate()} }
}

${options.className}.prototype.urlRoot = '/api/${options.plural}'
${options.className}.prototype.sync = require('backbone-http').sync(${options.className})
`
