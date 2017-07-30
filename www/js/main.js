var socket = io.connect(location.origin);

$(function() {
  var val = "test";
  socket.emit("insert", val);
});
