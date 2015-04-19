var models = require('../models/Models.js');

module.exports = {
    saveShift : function(shift, callback){
        models.ShiftAssignment.find({userId : shift.userId, time : shift.time}, function(err, dbshift){
            if(dbshift.length == 1)
            {
                var obj = dbshift[0];
                obj.role = shift.role;
                obj.save(function (err) {
                    if (err)
                    {
                        console.log(err);
                        callback("fail");
                    }
                    else
                        callback("success");
                });
            }
            else {
                shift.save(function (err) {
                    if (err)
                    {
                        callback("fail");
                    }
                    else
                        callback("success");
                });
            }
        });
        
    },
    
    saveShifts : function(shifts, callback){
        models.ShiftAssignment.collection.insert(shifts, function(err, docs){
            if (err)
            {
                console.log(err.toString());
                callback("fail");
            }
            else
                callback(docs);
        });
    },
    
    getShiftsByUser : function(userid, startDate, endDate, callback){
        models.ShiftAssignment.find({time: {$lte: endDate, $gte : startDate}, userId : userid}, function (err, shifts) {
            if (err) {
                return handleError(err);
            }
            else {
                callback(shifts);
            }
        });
    },
    
    getShiftsByDates : function(startDate, endDate, callback){
        models.ShiftAssignment.find({time: {$lte: endDate, $gte : startDate}}, function (err, shifts) {
            if (err) {
                return handleError(err);
            }
            else {
                callback(shifts);
            }
        });
    }
};