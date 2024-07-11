var mongoose = require('mongoose');



var profileSchema = new mongoose.Schema({

    username: {
        type: String,
        required: false
      },
      lastName: {
        type: String,
        required: false
      },
      email: {
        type: String,
        required: true,
        unique: false
      },
      password: {
        type: String,
        required: true,
      },
      dateCreated: {
        type: Date,
        default: Date.now
      },
      favourites: Array,
      UserType:{
        type: String,
        required: true
      }   
    });

const Person = mongoose.model('Members', profileSchema);
const member = new Person({
    username: 'mychem',  
    email: 'mychem@example.com',
    password: '123',
    favourites: [      
          "asdasd"
                ],
    UserType: 'User'
});

// name of table, schema name
module.exports = mongoose.model("Members",profileSchema)