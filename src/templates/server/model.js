
export default options =>
`import _ from 'lodash' // eslint-disable-line
import moment from 'moment'
import Backbone from 'backbone'
import {smartSync} from 'fl-server-utils'

const db_url = process.env.DATABASE_URL
if (!db_url) console.log('Missing process.env.DATABASE_URL')

export default class ${options.class_name} extends Backbone.Model {
  url = \`\$\{db_url\}/${options.plural}\`

  schema = () => _.extend({

  }, require('../../shared/models/schemas/${options.name}'))

  defaults() { return {created_at: moment.utc().toDate()} }
}

${options.class_name}.prototype.sync = smartSync(db_url, ${options.class_name})
`
