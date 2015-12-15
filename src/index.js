#! /usr/bin/env babel-node

import program from 'commander'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

program
  .version('0.0.1')
  .option('-l, --verbose', 'Show more information when the command is being excecuted')
  .option('-d, --dry_run', 'A dry_run run which will only list the effected records/files')
  .option('-f, --force', 'Force')

program
  .command('create_model <name>')
  .alias('add_model')
  .description('Create a new model in the current app')
  .action(name => {

    const options = {name, root: process.cwd(), force: program.force, verbose: program.verbose}

    if (
      !options.force && (
      !fs.existsSync(path.resolve(process.cwd(), 'client')) ||
      !fs.existsSync(path.resolve(process.cwd(), 'server')) ||
      !fs.existsSync(path.resolve(process.cwd(), 'shared')))) {
      return console.log(chalk.red(`This command should be run from the root directory of FounderLab web apps`))
    }

    console.log(`Creating model ${chalk.green(name)} with options`, options)
    require('./commands/create_model')(options)
  })

program.parse(process.argv)
