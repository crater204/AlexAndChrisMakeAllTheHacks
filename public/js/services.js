/**
 * Created by Alex on 10/1/2015.
 */
var app = angular.module('chatApp');

app.factory('socket', function ($rootScope)
{
    var socket = io.connect();
    return {
        on: function (eventName, callback)
        {
            socket.on(eventName, function ()
            {
                var args = arguments;
                $rootScope.$apply(function ()
                {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback)
        {
            socket.emit(eventName, data, function ()
            {
                var args = arguments;
                $rootScope.$apply(function ()
                {
                    if (callback)
                    {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
app.factory('toast', function ()
{
    return {
        message: function (notification)
        {
            console.log(notification);
        }
    };
});

