import _ from 'lodash' // eslint-disable-line
import chalk from 'chalk' // eslint-disable-line
import fs from 'fs'
import path from 'path'
import Queue from 'queue-async'
import mkdirp from 'mkdirp'
import inflection from 'inflection'
import createServerModel from '../templates/server/model'
import createServerController from '../templates/server/controller'
import createSharedModel from '../templates/shared/model'
import createSharedSchema from '../templates/shared/schema'

export default function createModel(_options, callback) {
  const options = {
    plural: inflection.pluralize(_options.name),
    class_name: inflection.classify(_options.name),
    ..._options,
  }
  options.class_plural = inflection.pluralize(options.class_name)

  const output = {
    server_model: {
      path: path.join(options.root, `server/models/${options.class_name}.js`),
      content: createServerModel(options),
    },
    server_controller: {
      path: path.join(options.root, `server/api/controllers/${options.class_plural}.js`),
      content: createServerController(options),
    },
    shared_model: {
      path: path.join(options.root, `shared/models/${options.class_name}.js`),
      content: createSharedModel(options),
    },
    shared_schema: {
      path: path.join(options.root, `shared/models/schemas/${options.name}.js`),
      content: createSharedSchema(options),
    },
  }

  const queue = new Queue()

  _.forEach(output, out => {
    if (!options.force && fs.existsSync(out.path)) {
      return callback(new Error(`File already exists at ${out.path}. Use --force to overwrite`))
    }
    queue.defer(callback => {
      mkdirp(path.dirname(out.path), err => {
        if (err) return callback(err)
        if (options.verbose) {
          console.log('writing:', out.path, out.content)
          console.log('---------------------')
        }
        fs.writeFile(out.path, out.content, callback)
      })
    })
  })

  queue.await(callback)

}
