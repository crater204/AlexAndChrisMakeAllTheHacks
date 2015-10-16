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

        /**
         *  @param data.user <string> = the new username
         *  @param data.pass <string> = the new password
         *
         *  @return 200 : OK
         *          400 : Bad Request: Username or password are null
         *          409 : Conflict: Username already exists (can't be duplicated)
         *          500 : Server Error: See Stacktrace
         *
         *  Purpose: To create a new user
         */
        socket.on('/api:createUser', function (data, callback)
        {
            //console.dir(data);
            if (data.user && data.pass)
            {
                sql.query('INSERT INTO users (username, password) value (?,?)', [data.user, data.pass], function (err, sqlData)
                {
                    if (!err)
                    {
                        //console.dir(sqlData);
                        callback(200);
                    }
                    else
                    {
                        console.error(err);
                        if (err.code === "ER_DUP_ENTRY")
                        {
                            callback(409);
                        }else{
                            callback(500)
                        }
                    }
                });
            }
            else
            {
                callback(400);
            }
        });

        socket.on('/api:login', function (data, callback)
        {
            console.dir(data);
        });

        socket.on('/api:send', function (data, callback)
        {
            console.dir(data);
            if (callback)
            {
                callback(200);
            }
        });

        /**
         *  @param data.userID <int> = [SQL receiver_id value] logged in user
         *  @param data.who <string> = [SQL sent_from value] sender username
         *
         *  @return sqlData <object>{message<string>,time_sent<timestamp>} = message with timestamp
         *      or
         *  @return error <int> = '500 internal server error'
         *
         *  Purpose: retrieve all messages from a specific sender
         */
        socket.on('/api:getMessages', function (data, callback)
        {
            //console.dir(data);
            queryStr = 'SELECT message, time_sent FROM messages WHERE receiver_id=?';
            queryParams = [data.userID];
            if (data.who !== '*')
            {
                queryStr += ' AND sent_from=?';
                queryParams.push(data.who);
            }
            sql.query(queryStr, queryParams, function (err, sqlData)
            {
                //console.dir(sqlData);
                if (!err)
                {
                    callback(sqlData);
                }
                else
                {
                    console.error(err);
                    callback(500);
                }
            });
        })
    });
}