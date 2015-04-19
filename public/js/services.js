angular.module('InfoCommonsApp').service(
            "RestCentralService",
            function( $http, $q ) {

                // Return public API.
                return({
                    addApplication: addApplication,
                    getStaffAssignment: getStaffAssignment,
                    getAllStaff: getAllStaff,
                    getStaff: getStaff,
                    saveShiftAssignment : saveShiftAssignment,
                    logOut : logOut,
                    getCurrentYearShifts : getCurrentYearShifts,
                    getAllShifts : getAllShifts,
                    getAllUserStats : getAllUserStats,
                    getCurrentStats : getCurrentStats,
                    getLoggedUser : getLoggedUser
                });

                // ---
                // PUBLIC METHODS.
                // ---
                
                function logOut() {
                    var request = $http({
                        method: "get",
                        url: "/logout"
                    });
                    return( request.then( handleSuccess, handleError ) );
                };
                
                function saveShiftAssignment(shiftAssignment) {
                    var request = $http({
                        method: "post",
                        url: "/saveShiftAssignment",
                        data: {
                            shiftAssign: shiftAssignment
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                };
                
                function getStaff(name) {
                    var request = $http({
                        method: "get",
                        url: "/searchStaff/"+name
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function getStaffAssignment(date) {
                    var request = $http({
                        method: "get",
                        url: "/getShifts/"+date
                    });
                    return( request.then( handleSuccess, handleError ) );
                };

                // add a application with the given name to the remote collection.
                function addApplication( app ) {
                    var request = $http({
                        method: "post",
                        url: "/saveApp",
                        data: {
                            app: app
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                };

                // get all of the applications in the remote collection.
                function getApplications() {
                    var request = $http({
                        method: "get",
                        url: "/getAllApps"
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function updateApplication(app){
                    var request = $http({
                        method: "post",
                        url: "/editApp",
                        data: {
                            app: app
                        }
                    });
                }
                
                function getCurrentYearShifts(userId) {
                    var request = $http({
                        method: "get",
                        url: "/getOldShifts/"+userId,
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function getAllStaff(){
                    var request = $http({
                        method: "get",
                        url : "/getStaff"
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function getAllShifts(startDate, endDate){
                    var request = $http({
                        method: "get",
                        url : "/getAllShifts",
                        params : {
                            start : startDate,
                            end : endDate
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function getAllUserStats(startDate, endDate){
                    var request = $http({
                        method: "get",
                        url : "/getAllUserStats",
                        params : {
                            start : startDate,
                            end : endDate
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function getLoggedUser(){                   
                    var request = $http({
                        method: "get",
                        url : "/getLoggedUser"
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function getCurrentStats(){
                    var midnightStart = new Date();
                    midnightStart.setHours(0,0,0,0);
                    var midnightEnd = new Date();
                    midnightEnd.setHours(8,0,0,0);
                    var noonStart = new Date();
                    noonStart.setHours(12,0,0,0);
                    var noonEnd = new Date();
                    noonEnd.setHours(16,0,0,0);
                    var evening = new Date();
                    evening.setHours(20,0,0,0);
                    var currentTime = new Date();
                    var startDate;
                    var endDate;
                    if (currentTime > midnightStart && currentTime < midnightEnd) {
                        startDate = midnightStart;
                        endDate = midnightEnd;
                    }
                    else if (currentTime > midnightEnd && currentTime < noonStart) {
                        startDate = midnightEnd;
                        endDate = noonStart;
                    }
                    else if (currentTime > noonStart && currentTime < noonEnd) {
                        startDate = noonStart;
                        endDate = noonEnd;
                    }
                    else if (currentTime > noonEnd && currentTime < evening) {
                        startDate = noonEnd;
                        endDate = evening;
                    }
                    else {
                        startDate = evening;
                        midnightStart.setDate(midnightStart.getDate() + 1);
                        endDate = midnightStart;
                    }
                    var request = $http({
                        method: "get",
                        url : "/getCurrentShift",
                        params : {
                            start : startDate,
                            end : endDate
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }


                // ---
                // PRIVATE METHODS.
                // ---

                // I transform the error response, unwrapping the application dta from
                // the API response payload.
                function handleError( response ) {

                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }

                // I transform the successful response, unwrapping the application data
                // from the API response payload.
                function handleSuccess( response ) {
                    return( response.data );
                }
            }
        );