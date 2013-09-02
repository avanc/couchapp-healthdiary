/*!
 * Copyright (C) 2013, Sven Klomp
 * 
 * Released under the MIT license
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */
var App = angular.module('CouchApp', ['CornerCouch'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {controller:StatisticsCtrl, templateUrl:'statistics.html'})
            .when('/new', {controller:InputCtrl, templateUrl:'input.html'})
            .otherwise({redirectTo:'/'});
    });

    
 App.directive('chart', function(){
    return{
        restrict: 'E',
        link: function(scope, elem, attrs){
            
            var chart = null,
                opts  = { };

            scope.$watch(attrs.ngModel, function(v) {
                //alert(scope.$root.$$phase)
                //alert(v)
                if(!chart) {
                    chart = $.plot(elem, [v] , opts);
                    elem.show();
                }
                else {
                    chart.setData([v]);
                    chart.setupGrid();
                    chart.draw();
                }
            });
        }
    };
});

    
    
function InputCtrl($scope, $window, cornercouch) {
    $scope.server = cornercouch();
    $scope.server.session();
    $scope.userdb = $scope.server.getDB('klomp');
    initEntry();
    
    $scope.submitData = function() {
        $scope.newentry.save()
            .success(function(data, status) {
                initEntry();
                $window.history.back();
            })
            .error(function(data, status) {
                alert(status);
                alert(data);
            });
    };
    
    function initEntry() {
        $scope.newentry = $scope.userdb.newDoc(); 
        $scope.newentry.type = "health";
        $scope.newentry.date = getIsoDate();
        $scope.newentry.time = getTime();
    }
}


function StatisticsCtrl($scope, cornercouch) {
    $scope.server = cornercouch();
    $scope.server.session();
    $scope.userdb = $scope.server.getDB('klomp');

    $scope.data={pulse: [[1,2], [3,4]]};
    
    $scope.userdb.query("health_diary", "heart_pulse", { include_docs: false, descending: true})
        .success(function(data, status) {
            var pulse=[];
            for (var i=0; i<data.rows.length; i++) {
                var row = data.rows[i];
                pulse.push([getTimestamp(row.key[0], row.key[1]), row.value]);
            }
            $scope.data.pulse=pulse;
        });
}

function getIsoDate(date) {
    if ( typeof(date) == "undefined" ) {
        date= new Date();
    }

    var year = date.getFullYear();
    
    var month = date.getMonth()+1;
    if(month <= 9)
        month = '0'+month;

    var day= date.getDate();
    if(day <= 9)
        day = '0'+day;

    var isoDate = year +'-'+ month +'-'+ day;
    return isoDate;
}

function getTime(date) {
    if ( typeof(date) == "undefined" ) {
        date= new Date();
    }

    var hours = date.getHours();
    var minutes = date.getMinutes();
    
    if(minutes <= 9)
        minutes = '0'+minutes;

    var isoTime = hours +':'+ minutes;
    return isoTime;
}

function getTimestamp(date, time) {
    if (typeof(time) === "undefined") {
        return (new Date(date)).getTime();
    }
    else {
        return (new Date(date+ "T" + time+":00")).getTime();
    }
    
}