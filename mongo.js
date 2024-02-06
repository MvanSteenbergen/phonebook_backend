const mongoose = require('mongoose')

if (process.argv.length < 2) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mvansteenbergen:${password}@cluster1.4f223tc.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', phonebookSchema)

if (process.argv.length < 4) {
    Entry.find({}).then(result => {
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const entry = new Entry({
        name: name,
        number: number,
    })

    entry.save().then(result => {
        console.log(`Added ${result.name} ${result.number} to the phonebook`)
        mongoose.connection.close()
    })

}






