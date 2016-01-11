import _ from 'lodash' // eslint-disable-line
import chalk from 'chalk' // eslint-disable-line
import fs from 'fs'
import path from 'path'
import Queue from 'queue-async'
import inflection from 'inflection'

const DEFAULT_NAME = 'FounderLab_replaceme'
const BASE_REPO_URL = 'git@bitbucket.org:founderlab/fl-base-webapp.git'

function replaceInFile(file_path, replacement_str, callback) {
  fs.readFile(file_path, (err, contents) => {
    if (err) return callback(err)
    const updated_contents = contents.replace(DEFAULT_NAME, replacement_str)
    fs.writeFile(file_path, updated_contents, callback)
  })
}

export default function newApp(_options, callback) {
  const options = {
    plural: inflection.pluralize(_options.name),
    safe_name: _options.name.replace('.', '_'),       // for database urls that may not like the periods (mongo)
    ..._options,
  }

  const app_path = path.join(root, options.name)

  const queue = new Queue()

  queue.defer(callback => {
    const clone = require('nodegit').Clone.clone
    clone(BASE_REPO_URL, app_path)
      .then(callback)
      .catch(err => callback(err))
  })

  queue.defer(callback => replaceInFile(path.join(app_path, 'package.json'), options.name, callback))
  queue.defer(callback => replaceInFile(path.join(app_path, '.env'), options.safe_name, callback))

  queue.await(callback)

}
