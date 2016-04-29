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
  const zipFile = './' + options.name+'.zip'
  const oldFolder = options.name+'-master'
  const newFolder = options.name
  // redirected from https://github.com/founderlab/fl-cli/archive/master.zip
  const url = 'https://codeload.github.com/founderlab/'+options.name+'/zip/master'
  const writer = fs.createWriteStream(zipFile)

  function callback() {
    const queue = new Queue()
    queue.defer(callback => {
      fs.access(zipFile, fs.F_OK, err => {
        if (err) return callback(err)
        fs.unlink(zipFile, err => {
          if (err) return callback(err)
          console.log('--Zip deleted.')
          return callback(null)
        })
      })
    })
    queue.defer(callback => {
      fs.access(oldFolder, fs.F_OK, err => {
        if (err) {// err means successfully renamed
          console.log('--Folder renamed to '+ newFolder + '.')
          return callback(null)
        } // otherwise delete the old folder
        rimraf(oldFolder, err => {
          if (err) return callback(err)
          console.log('--Folder ' + oldFolder + ' deleted.')
          return callback(new Error('Failed when renaming '+ oldFolder + ' to ' + newFolder + ', ' + newFolder + ' already exists.'))
        })
      })
    })
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
        fs.rename(oldFolder, newFolder, callback)
      })
    })
  })

}
