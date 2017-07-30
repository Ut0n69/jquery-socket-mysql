'use strict';

var SQL = {
  "pass": "",
  "databaseName": "",
  "usr": ""
};

var LISTEN_PORT = 3000;

var express = require('express');
var mysql = require('mysql');
var socketIO = require("socket.io");
var query;

var app = express();

// wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('www'));

// サーバを開始
var server = app.listen(LISTEN_PORT, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('It works!');
});


/*------------------
    MySQL
------------------*/
var dbConfig = {
  host: '127.0.0.1',
  user: SQL.usr,
  password: SQL.pass,
  database: SQL.databaseName,
  port: 3306
};

var dbConnection = mysql.createConnection(dbConfig);


/*------------------
    socket.io
------------------*/
var io = socketIO.listen(server);

// サーバーへのアクセス監視
io.sockets.on("connection", function(socket) {

  // データベースから値を取得
  socket.on("getSample", function() {
    dbConnection.query('SELECT * FROM sample', function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
    });
  });

  // データベースへ値の挿入
  socket.on("insert", function(data) {
    console.log(data);
    query = 'insert into sample(val1, val2 ) values("' + data + '", "tf");';
    dbConnection.query(query, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
    });
  });

});

/*------------------
    リダイレクト
------------------*/
app.get('/hoge', function(req, res) {
  res.sendFile(__dirname + '/www/hoge.html');
});

app.get('/api', function(req, res) {
  dbConnection.query('SELECT * FROM sample', function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);
  });
});
