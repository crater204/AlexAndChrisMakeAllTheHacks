/**
 * Created by Alex on 9/29/2015.
 */


var fs = require('fs');

module.exports = function(app)
{
    app.get('/', function (req, res)
    {
        getFile('public/views/index.html', res, 'text/html');
    });

    app.get('/css/style.css', function (req, res)
    {
        getFile('public/stylesheets/style.css', res, 'text/css');
    });

    app.get('/js/app.js',function(req, res){
        getFile('public/js/app.js',res,'text/css');
    });

    app.get('/js/index.controller.js',function(req, res){
       getFile('public/js/index.controller.js',res)
    });

    app.get('/js/services.js',function(req, res){
       getFile('public/js/services.js',res)
    });

    app.get('/socket.io.js',function(req, res){
        getFile('node_modules/socket.io/node_modules/socket.io.js',res);
    });

    function getFile(path, response, type)
    {
        fs.readFile(path, function (err, data)
        {
            if (!err)
            {
                //console.log('Requested: ' + path);
                response.set('content-type', type);
                response.send(data);
            }
            else
            {
                response.send("Oops Something Went Wrong");

            }
        });
    }
}