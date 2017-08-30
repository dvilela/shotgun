io(window.location.href).on('stream', function (data) {
  $("<span class='data'>" + data + "</span>").appendTo('#container');
});
