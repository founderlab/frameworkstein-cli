
export default options =>
`import _ from 'lodash' // eslint-disable-line
import RestController from 'fl-backbone-rest'
import {JSONUtils} from 'backbone-orm'
import {createAuthMiddleware} from 'fl-auth-server'
import schema from '../../../shared/models/schemas/${options.variableName}'
import ${options.className} from '../../models/${options.className}'

const whitelist = [
  'id',
  ..._.keys(schema),
]

export function canAccess(options, callback) {
  const {user, req} = options
  if (!user) return callback(null, false)
  if (user.admin) return callback(null, true)
  if (req.method === 'GET') return callback(null, true)

  const query = JSONUtils.parseQuery(req.query)
  if (query.$include) return callback(null, false, 'No $include')

  // Check if the current user is authorised to edit this model
  // const id = req.params.id

  callback(null, false)
}

export default class ${options.classPlural}Controller extends RestController {
  constructor(options) {
    super(options.app, _.defaults({
      model_type: ${options.className},
      route: '/api/${options.tableName}',
      auth: [...options.auth, createAuthMiddleware({canAccess})],
      templates: {
        base: require('../templates/${options.variablePlural}/base'),
      },
      default_template: 'base',
      whitelist: {
        create: whitelist,
        update: whitelist,
      },
    }, options))
  }
}
`
