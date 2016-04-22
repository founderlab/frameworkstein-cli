import fs from 'fs'
import https from 'https'
import unzip from 'unzip'

export default function newApp(_options, callback) {
  // download
  // redirected from https://github.com/founderlab/fl-cli/archive/master.zip
  const options = {
    name: _options.name,
    ..._options,
  }
  const url = 'https://codeload.github.com/founderlab/'+options.name+'/zip/master'
  const writer = fs.createWriteStream(options.name+'.zip')

  https.get(url, res => {
    res.on('data', d =>{
      writer.write(d)
    })
    // unzip to directory named <name>
    res.on('end', () =>{
      console.log('--Zip downloaded.')
      const stream = fs.createReadStream(options.name+'.zip').pipe(unzip.Extract({ path: './' }))

      stream.on('close', ()=>{
        console.log('--Zip extracted to folder '+options.name+'-master.')

        //should i check if there is a folder of that name exists? if so delete it?
        fs.rename('./'+options.name+'-master', './'+options.name, err => {
          if (err) {
          	// should i unlink folder fl-cli-master and file fl-cli.zip?
            return callback(err)
          }
          console.log('--Folder renamed to '+options.name+'.')

          fs.unlink('./'+options.name+'.zip', err => {
            if (err) return callback(err)
            console.log('--Zip deleted.')
            callback(null)
          })
        })
      })
    })
  })

}
