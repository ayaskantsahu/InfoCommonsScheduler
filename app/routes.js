var shiftDao = require('./dao/ShiftDao.js');
var models = require('./models/Models.js');
var helper = require('./helper.js');
var Client = require('node-rest-client').Client;
var client = new Client();
module.exports = function(app, passport) {
	

	// frontend routes =========================================================
	// route to handle all angular requests

	app.get('/', function(req, res) {
		req.redirect('/dashboard');
	});
	

	
	app.get('/getLoggedUser', function(req, res){
		if(req.user)
			res.json({user : req.user});
	});
	
	app.get('/getStaff', function(req,res){
			args = {
					headers:{"W-Token":"542414bf26330c3bb337c4c2f069714be071d249"} // request headers 
			};
			client.get("https://api.wheniwork.com/2/users", args, 
					function(data, response){
					// parsed response body as js object 
					console.log(data);
					
					res.json(data);
			});
	});
	
	app.post('/saveShiftAssignment', function(req, res){
		var shiftAssign = req.body.shiftAssign;
		var count = shiftAssign.length;
		for(shift in shiftAssign)
		{
			var shiftModel =  new models.ShiftAssignment(shiftAssign[shift]);
			shiftDao.saveShift(shiftModel, function(result){
				count--;
				if (count == 0) {
					res.json(result);
				}
			});
		}
	});
	
	app.get('/searchStaff/:searchTerm', function(req,res){
			var searchTerm = req.params.searchTerm;
			args = {
					headers:{"W-Token":"542414bf26330c3bb337c4c2f069714be071d249"} // request headers 
			};
			client.get("https://api.wheniwork.com/2/users", args, 
					function(data, response){
					// parsed response body as js object 
					console.log(data);
					var result = [];
					for(var i = 0; i < data.users.length; i++)
					{
							if (data.users[i].first_name.toLowerCase().lastIndexOf(searchTerm.toLowerCase(), 0) === 0 || data.users[i].last_name.toLowerCase().lastIndexOf(searchTerm.toLowerCase(), 0) === 0) {
									result.push(data.users[i]);
							}
					}
					res.json(result);
			});
	});
	
	app.get('/getShifts/:date', function(req,res){
		var date = req.params.date;
		var startDate = new Date(date);
		console.log(date + " - " +startDate.getMonth());
		var endDate = new Date();
		endDate.setDate(startDate.getDate() + 1);
		var startStr = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
		var endStr = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
		args = {
					headers:{"W-Token":"542414bf26330c3bb337c4c2f069714be071d249"}
		};
		console.log(args);
		var reqString = "https://api.wheniwork.com/2/shifts/?location_id="+"75480&start="+startStr+"&end=" +endStr;
		console.log(reqString);
		client.get(reqString, args, function(data, response){
				// parsed response body as js object 
				console.log("hi-"+data.shifts);
				
				var shifts = data.shifts;
				var respData = {};
				var shiftUserMap = {};
				var temp;
				for(var i=0; i < shifts.length; i++)
				{
					var user = getUser(data.users, shifts[i].user_id);
					if (shiftUserMap[shifts[i].start_time]) {
						temp = shiftUserMap[shifts[i].start_time];
						temp.push(user);
						shiftUserMap[shifts[i].start_time] = temp;
					}
					else {
						shiftUserMap[shifts[i].start_time] = [user];
					}
				}
				var assignments = models.ShiftAssignment.find({date : date}, function(err, data){
					respData.assigned = data;
					respData.staff = shiftUserMap;
					res.json(respData);	
				});
				
		});	
	});
	
	function getUser(users, userId){
		for(var i=0; i < users.length; i++)
		{
			if (users[i].id == userId) {
				return users[i];
			}
		}
	}
	
	app.get('/getOldShifts/:userId', function(req,res){
		var userId = req.params.userId;
		var start = new Date();
		start.setDate(1);
		start.setMonth(0);
		var end = new Date();
		end.setDate(31);
		end.setMonth(11);
		shiftDao.getShiftsByUser(userId, start, end, function(shifts){
			res.json(shifts);
		})
	});
	
	app.get('/dashboard', function(req, res){
		if (req.user) {
			res.sendfile('./public/index.html');
		}
		else {
			res.sendfile('./public/views/login.html');
		}
	});
	
	app.get('/getAllShifts', function(req, res){
		var startDate = new Date(req.query.start);
		var endDate = new Date(req.query.end);
		shiftDao.getShiftsByDates(startDate, endDate, function(shifts){
			var shiftUserMap = {};
			for(var i=0; i<shifts.length; i++)
			{
				if (shiftUserMap[shifts[i].time]) {
					shiftUserMap[shifts[i].time][shifts[i].role] = shifts[i].userName;
					shiftUserMap[shifts[i].time].Time = new Date(shifts[i].time);
				}
				else {
					shiftUserMap[shifts[i].time] = {
						"Time" : "",
						"Printing" : "",
						"Help Desk 1" : "",
						"Help Desk 2" : "",
						"Help Desk 3" : "",
						"Floater" : "",
						"DMC 1" : "",
						"DMC 2" : ""
					};
					shiftUserMap[shifts[i].time][shifts[i].role] = shifts[i].userName;
					shiftUserMap[shifts[i].time].Time = new Date(shifts[i].time);
				}
			}
			var shifts = [];
			for(key in shiftUserMap)
			{
				shifts.push(shiftUserMap[key]);
			}
			res.json(shifts);
		})
	});
	
	app.get('/getAllUserStats', function(req, res){
		var startDate = new Date(req.query.start);
		var endDate = new Date(req.query.end);
		shiftDao.getShiftsByDates(startDate, endDate, function(shifts){
			var userShiftsMap = {};
			var statList = [];
			for(var i=0; i<shifts.length; i++)
			{
				if (userShiftsMap[shifts[i].userId]) {
					userShiftsMap[shifts[i].userId].push(shifts[i]);
				}
				else {
					userShiftsMap[shifts[i].userId] = [];
					userShiftsMap[shifts[i].userId].push(shifts[i]);
				}
				console.log(userShiftsMap[shifts[i].userId]);
			}
			
			for(user in userShiftsMap)
			{
				var result = userShiftsMap[user];
				var count = 0;
				var dmc = 0;
				var printer = 0;
				var helpDesk = 0;
				var floater = 0;
				for(var i=0; i < result.length; i++)
				{
					count++;
					switch(result[i].role){
						case "Help Desk 1": helpDesk++; break;
						case "Help Desk 2": helpDesk++; break;
						case "Help Desk 3": helpDesk++; break;
						case "DMC 1": dmc++; break;
						case "DMC 2": dmc++; break;
						case "Floater": floater++; break;
						case "Printing": printer++; break;
						default : break;
					}
				}
				var stat = {
					"Name" : result[0].userName,
					"Help Desk" : ((helpDesk/count) * 100).toFixed(2) + "%",
					"Printing" : ((printer/count) * 100).toFixed(2) + "%",
					"Floater" : ((floater/count) * 100).toFixed(2) + "%",
					"DMC" : ((dmc/count) * 100).toFixed(2) + "%",
					"Total Shifts" : count
				};
				statList.push(stat);
			}
			res.json(statList);
		})
	});
	
	app.get('/getCurrentShift', function(req,res){
		var startDate = new Date(req.query.start);
		var endDate = new Date(req.query.end);
		args = {
					headers:{"W-Token":"542414bf26330c3bb337c4c2f069714be071d249"}
		};
		console.log(args);
		var reqString = "https://api.wheniwork.com/2/shifts/?location_id="+"75480&start="+startDate.toISOString()+"&end=" +endDate.toISOString();
		console.log(reqString);
		client.get(reqString, args, function(data, response){
			res.json(data);
		});
	});
	
	/* Handle Login POST */
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/index',
		failureRedirect: '/relogin',
		failureFlash : true 
	}));
	
	app.get('/relogin', function(req, res){
		res.sendfile('./public/views/relogin.html');
	});
       
	/* GET Registration Page */
	app.get('/signup', function(req, res){
		res.sendfile('./public/views/register.html');
	});
       
	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash : true 
	}));
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// frontend routes =========================================================
	// route to handle all angular requests
	
	/* GET login page. */
	app.get('/login', function(req, res) {
		// Display the Login page with any flash message, if any
		res.sendfile('./public/views/login.html');
	});
	
	app.get('/index', function(req, res) {
		console.log("index");
		if (req.user) {
			res.sendfile('./public/index.html');
		}
		else {
			res.sendfile('./public/views/login.html');
		}
		
	});
	
	app.get('*', function(req, res) {
		if (req.user) {
			res.sendfile('./public/index.html');
		}
		else {
			res.sendfile('./public/views/login.html');
		}
	});
	
	
       
	

};