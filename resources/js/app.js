// global scope intact
(function(){

/**
 * Get query argument pairs from the hash-symbol-string in a url.
 * @return object an object containing pairs of argument names and values
 */
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

/**
 * Returns the current time in javascript milliseconds.
 * @return int time in milliseconds
 */
function get_now() {
  return (new Date()).getTime();
}

/**
 * Get the time remaining based on the current time and the supplied ending time.
 * @param  int start time when timer started
 * @param  int end   time when timer ended
 * @return int       differnece between end and now
 */
function get_time_remaining(start, end) {
  var now = get_now();
  var diff = end - now;
  return diff;
}

/**
 * Get the time elapsed based on the current time and the supplied starting time
 * @param  int start time when timer started
 * @param  int end   time when timer ended
 * @return int       differnece now and start
 */
function get_time_elapsed(start, end) {
  var now = get_now();
  var diff = now - start;
  return diff;
}

/**
 * Return an array of time legend signifiers (for humanize-duration.js),
 * based on ranges of time.
 * @param  int t a duration of time
 * @return array   the time legend signifiers
 */
function get_specificity_down(t) {
  function between(x, a, b) {return x > a && x < b;}

  var r;
  if (between(t, -120000, 120000)) {
    r = ['m', 's']
  } else if (between(t, -5400000, 5400000)) {
    r = ['h', 'm'];
  }  else if (between(t, -7200000, 7200000)) {
    r = ['h'];
  } else {
    r = ['m'];
  }

  return r;
}

// ============================

// debugging mode for vue?
Vue.config.debug = true;

var app = new Vue({
  el: '#app',

  data: {

    initial: {
      start: null,
      end: null,
    },

    time: {
      remaining: null,
      elapsed: null
    }

  },

  computed: {
    up: function() {
      var time = humanizeDuration(this.time.elapsed, {
        units: ['h', 'm'],
        round: true
      });
      return time;
    },

    up_indicator: function() {
      return 'elapsed';
    },

    down: function() {
      var time = humanizeDuration(this.time.remaining, {
        units: get_specificity_down(this.time.remaining),
        round: true
      });
      return time;
    },

    down_indicator: function() {
      var indicator = (this.time.remaining > 0) ? 'remaining' : 'over';
      return indicator;
    }

  }

});

var control = new Vue({
  el: '#control-panel',

  data: {

    duration: 60,
    offset: 0,

    visible: false

  },

  methods: {
    controlToggle: function(event) {
      this.visible = !this.visible;
    },
    controlSubmit: function(event) {
      // this bind allows this external function
      // to reference 'this' while being elsewhere in scope
      update_control_panel.bind(this, event);
    }
  }

});


// ============================

/**
 * Start the timer.
 * @param  int start a start time for the timer
 * @param  int end   a start time for the timer
 */
function start_timers(start, end) {
  console.log('start_timers: start = %o, end = %o', start, end);

  app.$data.initial = {
    start: start,
    end: end
  };

  var title = function(){
    document.title = app.up + ' ' + app.up_indicator + ' - timer';
  };

  var tick = function() {
    console.log('tick');

    app.$data.time = {
      remaining: get_time_remaining(app.$data.initial.start, app.$data.initial.end),
      elapsed: get_time_elapsed(app.$data.initial.start, app.$data.initial.end)
    };

    title();

  };

  tick();
  setInterval(tick, 1000);
}

/**
 * Handle the click event for the control panel save action.
 * @param  object event an event object
 */
function update_control_panel(event) {
  console.log('update_control_panel:click');

  // var duration = $('#duration').val();
  var duration = this.duration;

  // offset
  // by default offset = 0; otherwise it will move the start_time backwards in time
  // var offset = $('#offset').val();
  var offset = this.offset;
  var start = get_now() - (offset * 60 * 1000);

  var end = start + (duration * 60 * 1000)

  var hash = 'd=' + duration + '&e=' + end + '&s=' + start;
  window.location.hash = hash;
  location.reload();
}

/**
 * Set up the control panel events and default styles.
 * @param  {[type]} query an object of hash-symbol-string arguments
 */
function setup_control_panel(query) {
  console.log('setup_control_panel');

  // click handler for saving
  $('#save').on('click', update_control_panel);

  // click handler for opening/closing the control panel
  $('#control-panel-handle').on('click', function(event){
    $('#control-panel .inner').toggle();
    event.preventDefault();
  });

  // auto-hide on load
  $('#control-panel .inner').hide();

  // auto-show on no arguments provided
  if (!query.s || !query.e) {
    $('#control-panel .inner').show();
  }

}

/**
 * Set up the timer based on available query arguments.
 * @param  {[type]} query an object of hash-symbol-string arguments
 */
function setup_timers(query) {
  console.log('setup_timers');
  if (query.s && query.e) {
    console.log('onload: q = %o, e = %o', query.s, query.e);
    start_timers((query.s), (query.e));
  }
}

/**
 * Onload: do this.
 */
window.onload = function() {
  console.log('window:onload');

  var query = get_query_arguments();

  console.log('onload: query = %o', query);

  setup_timers(query);

  // setup_control_panel(query);
};


})();
