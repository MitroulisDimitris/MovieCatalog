const localStrategy = require('passport-local').Strategy;
var profileSchema = require('../models/profileSchema');



async function initialize(passport,getUserById){
    const authenticateUser = async (email,password,done) =>{
        //check email
        await profileSchema.findOne({email: email})
            .exec()
            .then(async user2 => {
                if (!user2){
                    //wrong email
                    console.log('no email');
                    return done(null, false, { message: 'No user with that email' })
                }
                try{
                    console.log('email: '+ email+ ' password: '+ password);
                    await profileSchema.findOne({$and:[{email: email},{password: password}]})
                    .exec()
                    .then(user => {
                        if (!user){
                            //wrong pass
                            console.log('wrong pass');
                            console.log('here');
                            return done(null,false,{message : 'Wrong Pass'});
                        }else{
                            //everything good
                            console.log('everything good');
                            const userData  = {
                                email : user.email,
                                userId : user._id,
                                username : user.username,
                                userType : user.UserType,
                                dateCreated : user.dateCreated,
   

                            }
                            return done(null,user);
                        }

                       
                            })
                
                }catch(e){
                    return done(e)


                }
    });
    
    }
    
    passport.use(new localStrategy({usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user,done) => {
        console.log('serialize');
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        profileSchema.findById(id, (err, user) => {
            done(err, user);
        });
      });
}

module.exports =  initialize