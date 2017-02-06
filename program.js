const lwip = require('lwip')
const fs = require('fs')


const orientation = process.argv[2]
const pixels = ~~(process.argv[3])
const default_directory = (typeof process.argv[4] === "string") ? process.argv[4] : "files"

fs.readdir(`${__dirname}/${default_directory}`, (err, collection) => {
    if(err) return console.log(err)        
    let filtered = collection.filter(file => {
        return file.endsWith('.png')
    })
    resizeFilenames(filtered)
})

function resizeFilenames(collection) {
    recursive(collection, resizeImage)
}
function resizeImage(filename, next) {
    let path = `${__dirname}/${default_directory}/${filename}`
    lwip.open(path, (err, image) => {
        if(err) return console.log('error')
        let img = getNewDimension(~~(image.width()), ~~(image.height()))
        image.resize(img.width, img.height, "lanczos", (err, image) => {
            if(!err) {
                console.log(`${filename}, resized`)
                image.writeFile(path, () => {
                    console.log('saved')
                    next()    
                })
                
            }
        })
    })
}
function getNewDimension(w, h) {
    let aspect = (orientation == "width") ? h/w : w/h
    let width = (orientation == "width") ? pixels : pixels * aspect
    let height = (orientation != "width") ? pixels : pixels * aspect
    return {
        width,
        height
    }
}
function recursive(ary, fn) {
    let _index = 1
    function loop() {
        fn(ary[_index - 1], function() {
            _index++
            if(_index <= ary.length) loop()
            else console.log('finished')
        })   
    }
    loop()
}




