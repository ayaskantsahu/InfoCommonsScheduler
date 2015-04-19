var models = require('../models/Models.js');

module.exports = {
    
    saveUser : function(user, callback){
        user.save(function (err) {
            if(err)
            {
                console.log(err);
                callback("fail");
            }
            else
            {
                callback("success");
            }
        });
    },
    
    findByUsername : function(username, callback){
        models.User.findOne({'username':username}, function(err, user) {
            if (err) {
                console.log(err);
            }
            if (user) {
                console.log("found");
                callback(user);
            }
            else
            {
                console.log("User not found");
                callback(null);
            }
        });
    }
};