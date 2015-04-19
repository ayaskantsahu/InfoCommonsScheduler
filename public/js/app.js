var app = angular.module('InfoCommonsApp', ['ngRoute','ui.bootstrap','ui.grid','ui.grid.pagination']);
var roles = ["Printing", "Help Desk 1", "Help Desk 2", "Help Desk 3", "Floater", "DMC 1", "DMC 2"];


app.controller('parentController', function($scope, RestCentralService, $window) {
    RestCentralService.getLoggedUser().then(function(result){
        $scope.loggedUser = result.user.username;
    });
    $scope.logOut = function(){
        RestCentralService.logOut();
        $window.location.href = "/login";
    }
});

app.controller('AssignRoleController', function($scope, RestCentralService, $location) {
    $scope.data = [];
    $scope.users = [];
    $scope.roles = roles;
    $scope.assignments = {};
    var currentTime;
    $scope.getStaffAssignment = function(){
        if (!$scope.selectedDate) {
            $("#error").html('<div class="alert alert-danger alert-error"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Error!</strong> Please enter a date</div>');
            return;
        }
        RestCentralService.getStaffAssignment($scope.selectedDate.toString()).then(function(result) {
            $scope.data = result.staff;
        });
    }
    
    $scope.populateAssignment = function(time){
        currentTime = time;
        var users = $scope.data[time];
        $scope.users = users;
    }
    
    
    $scope.clear = function () {
        $scope.dt = null;
    };
    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    
    $scope.saveShiftAssignment = function(){
        var assignment = $scope.assignments;
        var data = [];
        for(key in assignment)
        {
            var dt = new Date(currentTime);
            var usrName;
            for(var i=0; i < $scope.users.length; i++)
            {
                if ($scope.users[i].id == assignment[key]) {
                    usrName = $scope.users[i].first_name + " " + $scope.users[i].last_name;
                    break;
                }
            }
            data.push({userId : assignment[key], role : key, time : dt.toString(), userName : usrName});
        }
        RestCentralService.saveShiftAssignment(data).then(function(result) {
            console.log(result);
            if (result === "success") {
                $("#error").html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Success!</strong> Roles saved!!</div>');
            }
        });
    }
});


app.controller('AllStaffController', function($scope, RestCentralService, $location) {
    
    $scope.selectedStaff = {name : ""};
    $scope.stats = null;
    $scope.getStaff = function(name){
        return RestCentralService.getStaff(name).then(function(result){
            var names = [];
            for(var i=0; i< result.length; i++)
            {
                var img = result[i].avatar.url.substring(0, result[i].avatar.url.length - 3);
                names.push({name : result[i].first_name + " "+result[i].last_name, data : result[i], img : img});
            }
            return names;
        });
    };
    
    $scope.getStats = function(){
        RestCentralService.getCurrentYearShifts($scope.selectedStaff.data.id).then(function(result){
            var count = 0;
            var dmc = 0;
            var printer = 0;
            var helpDesk = 0;
            var floater = 0;
            for(var i=0; i< result.length; i++)
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
            $scope.stats = {};
            $scope.stats.helpDesk = ((helpDesk/count) * 100).toFixed(2);
            $scope.stats.floater = ((floater/count) * 100).toFixed(2);
            $scope.stats.printer = ((printer/count) * 100).toFixed(2);
            $scope.stats.dmc = ((dmc/count) * 100).toFixed(2);
            $scope.stats.total = count;
        });
    }
});

app.controller('AllStaffDetailsController', function($scope, RestCentralService, $routeParams) {

    $scope.data=null;
    $scope.getShifts = function(){
        if (!$scope.startDate || !$scope.endDate) {
            $("#error").html('<div class="alert alert-danger alert-error"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Error!</strong> Please enter both dates</div>');
            return;
        }
        RestCentralService.getAllUserStats($scope.startDate, $scope.endDate).then(function(result){
            $scope.data = result;    
        });
    };
    $scope.clear1 = function () {
        $scope.startDate = null;
    };
    
    $scope.clear2 = function () {
        $scope.endDate = null;
    };
    
    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
    };
    
    $scope.open2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    };
    
    $scope.gridOptions1 = {
        paginationPageSizes: [5, 10, 50],
        paginationPageSize: 10,
        columnDefs: [
            { name: 'Name' },
            { name: 'Help Desk' },
            { name: 'Printing' },
            { name: 'Floater' },
            { name: 'Dmc' },
            { name: 'Total Shifts' }
        ]
    };
});

app.controller('TimeRangeController', function($scope, RestCentralService, $routeParams){
    $scope.data=null;
    $scope.getShifts = function(event){
        if (!$scope.startDate || !$scope.endDate) {
            $("#error").html('<div class="alert alert-danger alert-error"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Error!</strong> Please enter both dates</div>');
            return;
        }
        RestCentralService.getAllShifts($scope.startDate, $scope.endDate).then(function(result){
            $scope.data = result;    
        });
    };
    $scope.clear1 = function () {
        $scope.startDate = null;
    };
    
    $scope.clear2 = function () {
        $scope.endDate = null;
    };
    
    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
    };
    
    $scope.open2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    };
    
    $scope.gridOptions1 = {
        paginationPageSizes: [5, 10, 50],
        paginationPageSize: 10,
        columnDefs: [
            { name: 'Time' },
            { name: 'Printing' },
            { name: 'Help Desk 1' },
            { name: 'Help Desk 2' },
            { name: 'Help Desk 3' },
            { name: 'Floater' },
            { name: 'DMC 1' },
            { name: 'DMC 2' }
        ]
    };
});

app.controller('DashboardController', function($scope, RestCentralService, $location) {
    $scope.staffCount = "";
    $scope.shiftStart = "";
    $scope.shiftEnd = "";
    $scope.openShifts = "";
    $scope.staff = [];
    $scope.getStats = function(){
        RestCentralService.getCurrentStats().then(function(result){
            $scope.staffCount = result.users.length;
            $scope.shiftStart = new Date(result.start);
            $scope.shiftEnd = new Date(result.end);
            $scope.openShifts = result.shifts.length - result.users.length;
            for (i in result.shifts) {
                $scope.staff.push({name : result.users[i].first_name + " "+result.users[i].last_name, img : result.users[i].avatar.url.substring(0, result.users[i].avatar.url.length - 3)});
            }           
        });
    };
    $scope.getStats();
});