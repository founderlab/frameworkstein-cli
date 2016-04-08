#! /usr/bin/env babel-node

import program from 'commander'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import https from 'https'
import unzip from 'unzip'

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
    require('./commands/createModel')(options, err => {
      if (err) return console.log(chalk.red(err.message))
      console.log(chalk.green('done'))
    })
  })

program
  .command('new <name>')
  .description('Create a new app')
  .option('-t, --type', 'Type')
  .action(name => {

    const options = {name, root: process.cwd(), force: program.force, verbose: program.verbose}

    console.log(`Creating new app ${chalk.green(name)} with options`, options)

    // download
    // redirected from https://github.com/founderlab/fl-cli/archive/master.zip
    var url = 'https://codeload.github.com/founderlab/'+name+'/zip/master'
    var writer = fs.createWriteStream(name+'.zip');
    https.get(url, (res) => {
      res.on('data', (d) => {
        writer.write(d);
      });// end of res.on data

      // unzip to directory named <name>
      res.on('end', function(){
        console.log('--Zip downloaded.');
        var stream = fs.createReadStream(name+'.zip').pipe(unzip.Extract({ path: './' }));
        console.log('--Zip extracted to folder '+name+'-master.');
        stream.on('close',function(){
            fs.rename('./'+name+'-master', './'+name,(e)=>{});
            console.log('--Folder renamed to '+name+'.');
        })// end of stream.on close
      });// end of res.on end

    })// end of https.get
  })

program.parse(process.argv)
