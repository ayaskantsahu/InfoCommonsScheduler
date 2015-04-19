var models = require('../models/Models.js');

module.exports = {
    saveApplication : function(app, callback){
        app.save(function (err) {
            if (err)
            {
                callback("fail");
                return handleError(err);
            }
            else
                callback("success");
        });
    },
    
    getApplication : function(id, callback){
        models.Application.findById(id, function (err, application) {
            callback(application);
        });
    },
    
    getAllApplications : function(userId, callback){
        console.log("searching apps for " + userId);
        models.Application.find({userId : userId}, function (err, applications) {
            if (err) {
                console.log(err);
            }
            callback(applications);
        });
    },
    
    deleteApplication : function(appId, callback){
        console.log(appId);
        models.Application.findByIdAndRemove(appId, function(err, modelDeleted){
            
            if (err)
            {
                callback("fail");
            }
            else
                callback("success");    
        });
    }
};