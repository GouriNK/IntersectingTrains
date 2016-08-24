'use strict';
angular.module("tramsApp", []).controller("AppController", ['$scope',
    function($scope) {
        var dotsArray = ['red-dot', 'blue-dot', 'green-dot'];
        var square_railwayLines = { 'red-dot': [{ "x": 150, "y": 275 }, { "x": 200, "y": 275 }, { "x": 250, "y": 275 }, { "x": 300, "y": 275 }, { "x": 350, "y": 275 },  { "x": 400, "y": 275 }, { "x": 450, "y": 275 } ], 'blue-dot': [{ "x": 250, "y": 175 }, { "x": 250, "y": 225 }, { "x": 250, "y": 275 },  { "x": 250, "y": 325 }, { "x": 250, "y": 375 }, { "x": 250, "y": 425 }, { "x": 250, "y": 475 } ], 'green-dot': [{ "x": 350, "y": 75 },  { "x": 350, "y": 125 }, { "x": 350, "y": 175 },  { "x": 350, "y": 225 }, { "x": 350, "y": 275 },  { "x": 350, "y": 325 }, { "x": 350, "y": 375 } ] }; 
        var cross_railwayLines = { 'red-dot': [{ "x": 150, "y": 275 }, { "x": 200, "y": 275 }, { "x": 250, "y": 275 },  { "x": 300, "y": 275 }, { "x": 350, "y": 275 },  { "x": 400, "y": 275 }, { "x": 450, "y": 275 } ], 'blue-dot': [{ "x": 200, "y": 188 }, { "x": 225, "y": 232 }, { "x": 250, "y": 275 },  { "x": 275, "y": 318 },  { "x": 300, "y": 362 }, { "x": 325, "y": 405 }, { "x": 350, "y": 448 } ], 'green-dot': [{ "x": 250, "y": 448 }, { "x": 275, "y": 405 },  { "x": 300, "y": 362 }, { "x": 325, "y": 318 }, { "x": 350, "y": 275 }, { "x": 375, "y": 232 }, { "x": 400, "y": 188 } ] }; 
        $scope.railwayLines = angular.copy(cross_railwayLines,{});
        var overAnimate = { 'red-dot': false, 'blue-dot': false, 'green-dot': false } 
        var originalLoc = { 'red-dot': $scope.railwayLines['red-dot'][0], 'blue-dot': $scope.railwayLines['blue-dot'][0], 'green-dot': $scope.railwayLines['green-dot'][0] }; 
        $scope.priority = { 'red-dot': 90, 'blue-dot': 50, 'green-dot': 100 }; 
        $scope.currentLoc = angular.copy(originalLoc, {});
        var deltaLoc = { 'red-dot': { 'dx': 0, 'dy': 0 }, 'blue-dot': { 'dx': 0, 'dy': 0 }, 'green-dot': { 'dx': 0, 'dy': 0 } }; 
        var speed = { 'red-dot': { 'speedX': 0, 'speedY': 0 }, 'blue-dot': { 'speedX': 0, 'speedY': 0 }, 'green-dot': { 'speedX': 0, 'speedY': 0 } }; 
        var offset = { 'red-dot': { 'offsetX': 0, 'offsetY': 0 }, 'blue-dot': { 'offsetX': 0, 'offsetY': 0 }, 'green-dot': { 'offsetX': 0, 'offsetY': 0 } }; 
        var startAndEndPoints = { 'red-dot': { 'startX': 0, 'startY': 0, 'endX': 0, 'endY': 0 }, 'blue-dot': { 'startX': 0, 'startY': 0, 'endX': 0, 'endY': 0 }, 'green-dot': { 'startX': 0, 'startY': 0, 'endX': 0, 'endY': 0 } }; 
        $scope.valid_priority =  { 'red-dot': true, 'blue-dot': true, 'green-dot': true }; 
        var intervalId = null;
        var animateTime = 20;
        var goToIndex = ($scope.railwayLines['red-dot'].length - 1);
        $scope.paused = null;
        $scope.totalTime = 6000;
        $scope.pathname='Path 1';

        /*function to check for probable collision of trams*/
        function checkForCollision() {
            var collision = {};
            collision.isCollide = false;
            collision.collided1 = '';
            collision.collided2 = '';
            collision.notInvolved = '';
            var a = getCurrentDot('red-dot');
            var b = getCurrentDot('blue-dot');
            var c = getCurrentDot('green-dot');
            var aBound = a.dot.getBoundingClientRect();
            var bBound = b.dot.getBoundingClientRect();
            var cBound = c.dot.getBoundingClientRect();
            if (!(aBound.left > bBound.right || aBound.right < bBound.left || aBound.top > bBound.bottom || aBound.bottom < bBound.top)) {
                collision.isCollide = true;
                collision.collided1 = 'red-dot';
                collision.collided2 = 'blue-dot';
                collision.notInvolved = 'green-dot';
                return collision;
            } else if (!(bBound.left > cBound.right || bBound.right < cBound.left || bBound.top > cBound.bottom || bBound.bottom < cBound.top)) {
                collision.isCollide = true;
                collision.collided1 = 'blue-dot';
                collision.collided2 = 'green-dot';
                collision.notInvolved = 'red-dot';
                return collision;

            } else if (!(cBound.left > aBound.right || cBound.right < aBound.left || cBound.top > aBound.bottom || cBound.bottom < aBound.top)) {
                collision.isCollide = true;
                collision.collided1 = 'green-dot';
                collision.collided2 = 'red-dot';
                collision.notInvolved = 'blue-dot';
                return collision;
            }
            return collision;

        }
        /*function to get current location details of tram on DOM, by ID*/
        function getCurrentDot(id) {
            var dotVar = {};
            var currDot = document.getElementById(id);
            var currDotLeft = parseInt(currDot.getAttribute("cx"));
            var currDotTop = parseInt(currDot.getAttribute("cy"));
            dotVar.dot = currDot;
            dotVar.x = currDotLeft;
            dotVar.y = currDotTop;
            return dotVar;

        }
        /*function to calculate total distance to be covered for each tram*/
        function calculateDelta() {
            for (var i in dotsArray) {
                deltaLoc[dotsArray[i]].dy = $scope.railwayLines[dotsArray[i]][goToIndex].y - $scope.currentLoc[dotsArray[i]].y;
                deltaLoc[dotsArray[i]].dx = $scope.railwayLines[dotsArray[i]][goToIndex].x - $scope.currentLoc[dotsArray[i]].x;
            }
            
        }

        /*function to calculate speed for each tram*/
        function calculateSpeed() {
            for (var i in dotsArray) {
                speed[dotsArray[i]].speedX = deltaLoc[dotsArray[i]].dx / $scope.totalTime;
                speed[dotsArray[i]].speedY = deltaLoc[dotsArray[i]].dy / $scope.totalTime;
            }
            
        }

        /*function to calculate distance intervals*/
        function calculateOffset() {
            for (var i in dotsArray) {
                offset[dotsArray[i]].offsetX = speed[dotsArray[i]].speedX * animateTime;
                offset[dotsArray[i]].offsetY = speed[dotsArray[i]].speedY * animateTime;
            }
            
        }

        /*function to set the start and end points for each tram*/
        function setStartAndEndPoints(onward) {
            var start = (onward == true) ? 0 : goToIndex;
            var end = (onward == true) ? goToIndex : 0;
            for (var i in dotsArray) {
                startAndEndPoints[dotsArray[i]].startX = $scope.currentLoc[dotsArray[i]].x;
                startAndEndPoints[dotsArray[i]].startY = $scope.currentLoc[dotsArray[i]].y;
                startAndEndPoints[dotsArray[i]].endX = $scope.railwayLines[dotsArray[i]][end].x;
                startAndEndPoints[dotsArray[i]].endY = $scope.railwayLines[dotsArray[i]][end].y;
            }
            

        }
        /*function to check if input priority values by user are valid or not.*/
        function checkinputPriorityValidity(){
            var valid=true;
            for(var i in dotsArray){
                if($scope.priority[dotsArray[i]]==null){
                    $scope.valid_priority[dotsArray[i]]=false;
                    valid=false;
                }else if(parseInt(($scope.priority[dotsArray[i]])<0) || $scope.priority[dotsArray[i]]===undefined || $scope.priority[dotsArray[i]].toString()=="" || (parseFloat($scope.priority[dotsArray[i]]) % 1 != 0)){
                    $scope.valid_priority[dotsArray[i]]=false;
                    valid=false;
                }else{
                    $scope.valid_priority[dotsArray[i]]=true;
                }
            }
            return valid;
        }

        /*function to start tram*/
        $scope.startRailway = function() {
            if(checkinputPriorityValidity()==true){
                if ($scope.paused == false) {
                    $scope.currentLoc = angular.copy(originalLoc, {});
                }
                animate($scope.totalTime, false);
            }
        }

        /*function to stop tram*/
        $scope.resetRailway = function() {
            $scope.currentLoc = angular.copy(originalLoc, {});
            clearInterval(intervalId);
            goToIndex = 6;
            $scope.paused = null
        }

        /*function to pause tram*/
        $scope.pauseRailway = function() {
            $scope.paused = true;
            clearInterval(intervalId);
        }
        /*function to change the tram's track*/
        $scope.changeRailwayTrack=function(trackname){
            $scope.railwayLines = (trackname=="SQUARE") ? angular.copy(square_railwayLines,{}) : angular.copy(cross_railwayLines,{});
            $scope.pathname=(trackname=="SQUARE") ? 'Path 2':'Path 1';
            originalLoc = { 'red-dot': $scope.railwayLines['red-dot'][0], 'blue-dot': $scope.railwayLines['blue-dot'][0], 'green-dot': $scope.railwayLines['green-dot'][0] }; 
            $scope.resetRailway();
        }

        /*function to animate tram motion*/
        function animate(onward) {
            var updatedPoints = { 'red-dot': { 'x': 0, 'y': 0 }, 'blue-dot': { 'x': 0, 'y': 0 }, 'green-dot': { 'x': 0, 'y': 0 } }; 
            if ($scope.paused == false || $scope.paused == null) {
                setStartAndEndPoints(onward);
                calculateDelta();
                calculateSpeed();
                calculateOffset();
                $scope.paused = false
            } else if ($scope.paused == true) {
                $scope.paused = false;
            }
            intervalId = setInterval(function() {
                for (var i in dotsArray) {
                    var dotName = dotsArray[i];
                    //if($scope.railwayLines[dotName][goToIndex].x==$scope.currentLoc[dotName].x && $scope.railwayLines[dotName][goToIndex].y==$scope.currentLoc[dotName].y){
                    if (overAnimate[dotName] == true) {
                        updatedPoints[dotName] = angular.copy($scope.currentLoc[dotName], {});
                    } else {
                        updatedPoints[dotName].x = $scope.currentLoc[dotName].x + offset[dotName].offsetX;
                        updatedPoints[dotName].y = $scope.currentLoc[dotName].y + offset[dotName].offsetY;
                    }
                }
                var collision = checkForCollision();
                if (collision.isCollide == true) {
                    if (parseInt($scope.priority[collision.collided1]) >= parseInt($scope.priority[collision.collided2])) {
                        $scope.currentLoc[collision.collided1] = angular.copy(updatedPoints[collision.collided1], {});
                    } else if (parseInt($scope.priority[collision.collided2]) > parseInt($scope.priority[collision.collided1])) {
                        $scope.currentLoc[collision.collided2] = angular.copy(updatedPoints[collision.collided2], {});
                    }
                    $scope.currentLoc[collision.notInvolved] = angular.copy(updatedPoints[collision.notInvolved], {});
                } else {
                    $scope.currentLoc = angular.copy(updatedPoints, {});
                }
                comparePoints();
                if (overAnimate['red-dot'] == true && overAnimate['blue-dot'] == true && overAnimate['green-dot'] == true) {
                    goToIndex = (goToIndex == ($scope.railwayLines['red-dot'].length - 1)) ? 0 : ($scope.railwayLines['red-dot'].length - 1);
                    clearInterval(intervalId);
                    animate($scope.totalTime, (!onward));
                    overAnimate['red-dot'] = false;
                    overAnimate['blue-dot'] = false;
                    overAnimate['green-dot'] = false;

                }
                $scope.$apply();
            }, animateTime);
        }

        /*function to check for stpping tram motion*/
        function comparePoints() {
            for (var i in dotsArray) {
                var dotName = dotsArray[i];
                var aXRound = Math.round($scope.railwayLines[dotName][goToIndex].x);
                var aYRound = Math.round($scope.railwayLines[dotName][goToIndex].y);
                var bXRound = Math.round($scope.currentLoc[dotName].x);
                var bYRound = Math.round($scope.currentLoc[dotName].y);
                if ((aXRound == bXRound) && (aYRound == bYRound) && overAnimate[dotName] == false) {
                    overAnimate[dotName] = true;
                } else if (overAnimate[dotName] == false) {
                    overAnimate[dotName] = false;
                }
            }

        }

    }
]);

