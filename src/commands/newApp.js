import fs from 'fs'
import https from 'https'
import unzip from 'unzip'
import rimraf from 'rimraf'
import Queue from 'queue-async'
export default function newApp(_options, _callback) {

  const options = {
    name: _options.name,
    ..._options,
  }
  const zipFile = './fl-base-webapp.zip'
  const oldFolder = 'fl-base-webapp-master'
  const newFolder = options.name
  // redirected from https://github.com/founderlab/fl-cli/archive/master.zip
  const url = 'https://codeload.github.com/founderlab/fl-base-webapp/zip/master'
  const writer = fs.createWriteStream(zipFile)
  const pkgPath = './'+newFolder+'/package.json'
  const envPath = './'+newFolder+'/.env'

  function callback() {
    const queue = new Queue()
    queue.defer(callback => { // delete zip
      fs.access(zipFile, fs.F_OK, err => {
        if (err) return callback(err)
        fs.unlink(zipFile, err => {
          if (err) return callback(err)
          console.log('--Zip deleted.')
          return callback(null)
        })
      })
    })
    queue.defer(callback => { // delete folder
      fs.access(oldFolder, fs.F_OK, err => {
        if (err) {// err means successfully renamed
          return callback(null)
        } // otherwise delete the old folder
        rimraf(oldFolder, err => {
          if (err) return callback(err)
          console.log('--Folder ' + oldFolder + ' deleted.')
          return callback(new Error('Failed when renaming '+ oldFolder + ' to ' + newFolder + ', ' + newFolder + ' already exists.'))
        })
      })
    })
    // The queue seems to do the rest of its tasks and the final callback simultaneously when get an err.

    // queue.defer(callback => { // check .env modification
    //   fs.access(envPath, fs.R_OK, err => {
    //     if (err) return callback(err)
    //     fs.readFile(envPath, (err, data) => {
    //       if (err) return callback(err)
    //       const str = data.toString()
    //       const index = str.search(/FounderLab_replaceme/)
    //       if (index >= 0) return callback(new Error('Failed when modifying .env.'))
    //       return callback(null)
    //     })
    //   })
    // })
    // queue.defer(callback => { // check packge.json modification
    //   fs.access(pkgPath, fs.R_OK, err => {
    //     if (err) return callback(err)
    //     fs.readFile(pkgPath, (err, data) => {
    //       if (err) return callback(err)
    //       const str = data.toString()
    //       const index = str.search(/FounderLab_replaceme/)
    //       if (index >= 0) return callback(new Error('Failed when modifying package.json.'))
    //       return callback(null)
    //     })
    //   })
    // })
    queue.await(_callback)
  }

  // download, unzip, rename
  https.get(url, res => {
    res.on('data', d => {
      writer.write(d)
    })
    res.on('end', () => {
      console.log('--Zip downloaded.')
      const stream = fs.createReadStream(zipFile).pipe(unzip.Extract({ path: './' }))
      stream.on('close', () => {
        console.log('--Zip extracted to folder '+ oldFolder + '.')
        fs.rename(oldFolder, newFolder, err => {
          if (err) return callback(err)
          console.log('--Folder renamed to '+ newFolder + '.')
          const queue = new Queue()
          queue.defer(callback => { //modify package.json
            fs.access(pkgPath, fs.W_OK|fs.R_OK, err => {
              if (err) return callback(err)
              fs.readFile(pkgPath, (err, data) => {
                if (err) return callback(err)
                const str = data.toString()
                const newStr = str.replace(/FounderLab_replaceme/g, options.name)
                fs.writeFile(pkgPath, newStr, err => {
                  if (err) return callback(err)
                  console.log('--package.json modified.')
                  callback(null)
                })
              })
            })
          })
          queue.defer(callback => { //modify .env
            fs.access(envPath, fs.W_OK|fs.R_OK, err => {
              if (err) return callback(err)
              fs.readFile(envPath, (err, data) => {
                if (err) return callback(err)
                const str = data.toString()
                // here should be a underscore thing, but i forgot what it is
                const newStr = str.replace(/FounderLab_replaceme/g, options.name.toLowerCase())
                fs.writeFile(envPath, newStr, err => {
                  if (err) return callback(err)
                  console.log('--.env modified.')
                  callback(null)
                })
              })
            })
          })
          queue.await(callback)
        })
      })
    })
  })

}
