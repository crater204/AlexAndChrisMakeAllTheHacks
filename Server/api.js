/**
 * Created by Alex on 9/29/2015.
 */

var mysql = require('mysql');

var sql = mysql.createConnection({
    host: 'localhost',
    user: 'chatAdmin',
    password: 'chatpass',
    database: 'chatserver'
});

sql.connect(function (err)
{
    if (!err)
    {
        console.log('Database connected.');
    }
    else
    {
        console.error('Database connection error\n\n');
    }
});

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

        socket.on('/api:login', function (data, callback)
        {

        });

        socket.on('/api:send', function (data, callback)
        {
            console.dir(data);
            if (callback)
            {
                callback("Message Sent");
            }
        });

        socket.on('/api:getMessages', function (data, callback)
        {
            console.dir(data);
            queryStr = '';
            queryParams = [];
            if (data.who !== '*')
            {
                queryStr = 'SELECT message, time_sent FROM messages WHERE receiver_id=? AND sent_from=?';
                queryParams =  [data.userID,data.who];
            } else{
                queryStr = 'SELECT message, time_sent FROM messages WHERE receiver_id=?';
                queryParams =  [data.userID];
            }
            sql.query(queryStr, queryParams, function (err, sqlData)
            {
                console.dir(sqlData);
                if (!err)
                {
                    console.error(err);
                    callback(sqlData);
                }
                else
                {
                    callback(500);
                }
            });
        })
    });
}