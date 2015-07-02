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

/**
 * ReactJS Component: CountUp.
 */
var CountUp = React.createClass({
  render: function() {

    if (!this.props.elapsed) {
      console.log('CountUp: not rendered');
      return null;
    }

    var time = humanizeDuration(this.props.elapsed, {
      units: ['h', 'm'],
      round: true
    });
    var string = time;

    var display = [<span key={1} className='number'>{string}</span>, ' elapsed'];

    return (
      <div className='count up'>
        {display}
      </div>
    );
  }
});

/**
 * ReactJS Component: CountDown.
 */
var CountDown = React.createClass({
  render: function() {

    if (!this.props.remaining) {
      console.log('CountDown: not rendered');
      return null;
    }

    var time = humanizeDuration(this.props.remaining, {
      units: get_specificity_down(this.props.remaining),
      round: true
    });
    var string = time;

    var indicator = (this.props.remaining > 0) ? 'remaining' : 'over';

    var display = [<span key={1} className='number'>{string}</span>, ' ', indicator];

    document.title = string + ' ' + indicator + ' - timer';

    return (
      <div className='count down'>
        {display}
      </div>
    );
  }
});

/**
 * ReactJS Component: Timer.
 *
 * Ideally, what this needs is refactoring such that the setInterval is on the outside of this 'class'.
 * Whatever that structure is, it would become the Timer and this would likely be renamed to TimerDisplay.
 */
var Timer = React.createClass({

  getInitialState: function() {
    return {
      remaining: null
    };
  },

  componentDidMount: function() {
    console.log('Timer: componentDidMount');
    this.timer = setInterval(this.tick, 1000);
    this.tick();
  },

  tick: function() {
    console.log('Timer: tick');

    this.setState({
      remaining: get_time_remaining(this.props.start_time, this.props.end_time),
      elapsed: get_time_elapsed(this.props.start_time, this.props.end_time)
    });

  },

  render: function() {

    var start_time = this.props.start_time ? this.props.start_time : null;
    var end_time = this.props.end_time ? this.props.end_time : null;

    if (!this.state.remaining || !this.state.elapsed) {
      console.log('Timer: not rendered');
      return null;
    }

    return (
      <div>
          <CountDown remaining={this.state.remaining} />
          <CountUp elapsed={this.state.elapsed} />
      </div>
    );
  }
});

/**
 * Start the timer.
 * @param  int start a start time for the timer
 * @param  int end   a start time for the timer
 */
function start_timers(start, end) {
  console.log('start_timers: start = %o, end = %o', start, end);

  var container = $('#container');
  var target = $(container).get(0);

  React.render(<Timer start_time={start} end_time={end} />, target);
}

/**
 * Handle the click event for the control panel save action.
 * @param  object event an event object
 */
function update_control_panel(event) {
  console.log('update_control_panel:click');

  var duration = $('#duration').val();

  // offset
  // by default offset = 0; otherwise it will move the start_time backwards in time
  var offset = $('#offset').val();
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

  $('#save').on('click', update_control_panel);

  $('#control-panel-handle').on('click', function(event){
    $('#control-panel .inner').toggle();
    event.preventDefault();
  });

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

  setup_control_panel(query);
};


})();
