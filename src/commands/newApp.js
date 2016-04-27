import fs from 'fs'
import https from 'https'
import unzip from 'unzip'
import rimraf from 'rimraf'
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

  function callback(_err) {
    // check zip accessibility
    fs.access(zipFile, fs.R_OK | fs.W_OK, err => {
      if (err) return _callback(err)
      fs.unlink(zipFile, err => {
        if (err) return _callback(err)
        console.log('--Zip deleted.')
        return _callback(_err)
      })
    })
  }

  const writer = fs.createWriteStream(zipFile)

  // download
  https.get(url, res => {
    res.on('data', d => {
      writer.write(d)
    })

    // unzip to directory named <name>
    res.on('end', () => {
      console.log('--Zip downloaded.')
      const stream = fs.createReadStream(zipFile).pipe(unzip.Extract({ path: './' }))
      stream.on('close', () => {
        console.log('--Zip extracted to folder '+ oldFolder + '.')
        fs.rename(oldFolder, newFolder, err1 => {
          if (err1) { // new folder exists, unlink folder fl-cli-master
            fs.access(oldFolder, fs.R_OK | fs.W_OK, err2 => {
              if (err2) return callback(err2)
              rimraf(oldFolder, err3 => {
                if (err3) return callback(err3)
                console.log('--Folder ' + oldFolder +' deleted.')
                return callback(err1)//successfully deleted oldFolder throw cant-rename error
              })
            })
          }
          else {
            // when without the else block, if renaming fails,
            // these 2 lines should not be executed, but somehow it does.
            // so i add it into a else block
            console.log('--Folder renamed to '+ newFolder + '.')
            return callback(err1)
          }
        })
      })
    })
  })

}
