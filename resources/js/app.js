function get_query_arguments() {
    var qs = (function(a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i)
      {
          var p=a[i].split('=', 2);
          if (p.length == 1)
              b[p[0]] = "";
          else
              b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
  })(window.location.hash.substr(1).split('&'));
  return qs;
}

class Clock {

  constructor() {
    console.log('Clock:constructor');
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    console.log('Clock:tick');
    this.update();
  }

  update() {
    console.log('Clock:update');
  }

  clear() {
    console.log('Clock:clear');
    clearInterval(this.timer);
  }

}


window.onload = function() {
  console.log('window:onload');
  var clock = new Clock();
};
