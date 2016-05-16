import fs from 'fs'
import https from 'https'
import unzip from 'unzip'
import rimraf from 'rimraf'
import Queue from 'queue-async'

// redirected from https://github.com/founderlab/fl-base-webapp/archive/master.zip
const REPO_ZIP_URL = 'https://codeload.github.com/founderlab/fl-base-mobile-app/zip/master'

function replaceString(fileName, oldStr, newStr, callback) {
  fs.access(fileName, fs.W_OK|fs.R_OK, err => {
    if (err) return callback(new Error(`String replacement failure: ${err}`))

    fs.readFile(fileName, (err, data) => { //read old file
      if (err) return callback(new Error(`String replacement failure: ${err}`))
      const txt = data.toString()
      const replacedTxt = txt.replace(oldStr, newStr)

      fs.writeFile(fileName+'_tmp', replacedTxt, err => { //write tmp file
        if (err) return callback(new Error(`String replacement failure: ${err}`))

        fs.unlink(fileName, err => { //delete old file
          if (err) return callback(new Error(`String replacement failure: ${err}`))

          fs.rename(fileName+'_tmp', fileName, err => { // rename tmp file
            if (err) return callback(new Error(`String replacement failure: ${err}`))
            return callback(null)
          })
        })
      })
    })
  })
}

export default function newMobile(_options, _callback) {

  const options = {
    name: _options.name,
    ..._options,
  }

  const zipFile = 'fl-base-mobile-app.zip'
  const oldFolder = 'fl-base-mobile-app-master'
  const newFolder = options.name
  const writer = fs.createWriteStream(zipFile)
  const pkgPath = newFolder+'/package.json'
  // const envPath = newFolder+'/.env'

  function callback(err) {
    const queue = new Queue()

    queue.defer(callback => { // delete zip
      fs.access(zipFile, fs.F_OK, err => {
        if (err) return callback(err)
        fs.unlink(zipFile, err => {
          if (err) return callback(err)
          if (options.verbose) console.log('--Zip deleted.')
          callback(null)
        })
      })
    })

    queue.defer(callback => { // delete old folder
      fs.access(oldFolder, fs.F_OK, err => {
        if (err) {// err means successfully renamed
          return callback(null)
        } // otherwise delete the old folder
        rimraf(oldFolder, err => {
          if (err) return callback(err)
          if (options.verbose) console.log('--Folder ' + oldFolder + ' deleted.')
          callback(new Error('Failed when renaming '+ oldFolder + ' to ' + newFolder + ', ' + newFolder + ' already exists.'))
        })
      })
    })

    if (err && err.message === `String replacement failure: ${err}`) {
      queue.defer(callback => { // delete new folder
        fs.access(newFolder, fs.F_OK, err => {
          if (err) return callback(err) // otherwise delete the old folder
          rimraf(newFolder, err => {
            if (err) return callback(err)
            if (options.verbose) console.log('--Folder ' + newFolder + ' deleted.')
            callback(new Error('Failed when modifying package.json.'))
          })
        })
      })
    }

    queue.await(_callback)
  }

  // download, unzip, rename
  https.get(REPO_ZIP_URL, res => {
    res.on('data', d => writer.write(d))

    res.on('end', () => {
      if (options.verbose) console.log('--Zip downloaded.')
      const stream = fs.createReadStream(zipFile).pipe(unzip.Extract({path: './'}))

      stream.on('close', () => {
        if (options.verbose) console.log('--Zip extracted to folder '+ oldFolder + '.')

        fs.rename(oldFolder, newFolder, err => {
          if (err) return callback(err)
          if (options.verbose) console.log('--Folder renamed to '+ newFolder + '.')
          const queue = new Queue()

          // modify package.json
          queue.defer(callback => {
            replaceString(pkgPath, /FounderLab_replaceme/g, options.name, err => {
              if (err) return callback(err)
              if (options.verbose) console.log('--'+fileName+' modified.')
              callback()
            })
          })

          // //modify .env
          // queue.defer(callback => {
          //   replaceString(envPath, /FounderLab_replaceme/g, options.name.toLowerCase().replace(/\W/g, '_'), err => {
          //     if (err) return callback(err)
          //     if (options.verbose) console.log('--'+fileName+' modified.')
          //     callback()
          //   })
          // })

          queue.await(callback)
        })
      })
    })
  })

}
