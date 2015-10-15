/**
 * Created by Alex on 10/1/2015.
 */

var app = angular.module('chatApp');

app.controller('IndexCtrl', ['$rootScope', '$scope', 'socket', 'toast', indexController]);

function indexController($rootScope, $scope, socket, toast)
{
    $scope.username = '';
    $scope.message = '';

    this.send = function ()
    {
        if ($scope.username !== null && $scope.username !== "")
        {
            if ($scope.message !== null && $scope.message !== "")
            {
                socket.emit('/api:send', {'sender': $scope.username, 'message': $scope.message}, function (reply)
                {
                    toast.message(reply)
                });
            }
            else
            {
                alert('Please Enter a Message');
            }
        }
        else
        {
            alert('Please enter a Username');
        }
    };

    this.getMessagesFrom = function(user)
    {
        socket.emit("/api:getMessages",{"userID":"1","who":user},function(){

        });
    };
}