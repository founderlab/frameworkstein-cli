
export default options =>
`import _ from 'lodash' // eslint-disable-line
import RestController from 'backbone-rest'
import {createAuthMiddleware} from 'fl-auth-server'

function canAccess(options, callback) {
  const {user, req} = options
  callback(null, true)
}

export default class ${options.class_plural}Controller extends RestController {
  constructor(options) {
    super(options.app, _.defaults({
      model_type: require('../../models/${options.name}'),
      route: '/api/${options.plural}',
      auth: [...options.auth, createAuthMiddleware({canAccess})],
      whitelist: {

      },
    }, options))
  }
}
`
