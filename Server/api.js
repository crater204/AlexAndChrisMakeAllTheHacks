/**
 * Created by Alex on 9/29/2015.
 */

var mysql = require('mysql');
var sqlLogin = require('./SQLData.js');

var sql = mysql.createConnection(sqlLogin);

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

var user = function (id, socket)
{
    return {
        'id': id,
        'socket': socket
    };
};

//an array of sockets addresses that are not logged in
var viewing = [];
//array of USER objects that are signed in
var signedIn = [];

module.exports = function (io)
{
    io.on('connection', function (socket)
    {
        console.log('Connected to: ' + socket.handshake.address);
        viewing.push(socket);

        /**
         * Purpose: test socket connection
         */
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
                        }
                        else
                        {
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

        /**
         * @param data.username <string> = username of the user
         * @param data.password <string> = password of the user
         *
         * @return  200: successful login
         *          401: incorrect username or password
         *          500: internal server error - multiple matching usernames
         *
         * Purpose: Allow user to login with their username and password
         */
        socket.on('/api:login', function (data, callback)
        {
            console.dir(data);
            sql.query('SELECT password FROM users WHERE username = ?', [data.username], function (err, jsonData)
            {
                if (!err)
                {
                    if (jsonData.length === 1)
                    {
                        if (jsonData[0].password === data.password)
                        {
                            //success
                            signedIn.push(user(jsonData.id, socket.handshake.address));
                            console.dir(signedIn);
                            //remove the users from viewing array and add them to the user array
                            if ((index = viewing.indexOf(socket))>-1)
                            {
                                viewing.splice(index,1);
                            }
                            signedIn.push(user(jsonData.id,socket));
                            callback({'status': 200, 'userID': jsonData.id});
                        }
                        else
                        {
                            //not right password
                            callback({'status': 401});
                        }
                    }
                    else
                    {
                        //server error (too many same usernames)
                        callback({'status': 500});
                    }
                }
                else
                {
                    console.error(err);
                }
            });
        });

        /**
         * @return username<array>
         *
         * Purpose: Give a list of all usernames to the client
         */
        socket.on('/api:getUsers', function (data, callback)
        {
            sql.query('SELECT username, id FROM users', [], function (err, jsonData)
            {
                callback(jsonData);
            });
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
        });

        /**
         * Purpose: Warn that connection has been closed
         */
        socket.on('disconnect', function ()
        {
            console.log('User disconnected from: ' + socket.handshake.address);
            var index = viewing.indexOf(socket);
            console.log(index);
            if (index > -1)
            {
                viewing.splice(index,1);
            }
        });
    });
};