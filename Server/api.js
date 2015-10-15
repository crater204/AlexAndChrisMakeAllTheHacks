/**
 * Created by Alex on 9/29/2015.
 */

var sql = require('mysql');

module.exports = function (io)
{
    io.on('connection', function (socket)
    {
        console.log('Connected to: ' + socket.handshake.address);

        socket.on('/api:test', function (data, callback)
        {
            console.log(socket.id + " : " + data);
            callback("It worked");
        });

        socket.on('/api:login', function(data, callback){

        });

        socket.on('/api:send', function (data, callback)
        {
            console.dir(data);
            if (callback)
            {
                callback("Message Sent");
            }
        });

        socket.on('/api:getMessages', function(data, callback){
            test=data.who;
            console.log(test);
        })
    });
}