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

function get_now() {
  return (new Date()).getTime();
}

function get_time_remaining(start, end) {
  var now = get_now();
  var diff = end - now;
  return diff;
}

function get_time_elapsed(start, end) {
  var now = get_now();
  var diff = now - start;
  return diff;
}

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

var CountDown = React.createClass({
  render: function() {

    if (!this.props.remaining) {
      console.log('CountDown: not rendered');
      return null;
    }

    var time = humanizeDuration(this.props.remaining, {
      // units: ['h', 'm', 's'],
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

var Clock = React.createClass({

  getInitialState: function() {
    return {
      remaining: null
    };
  },

  componentDidMount: function() {
    console.log('Clock:componentDidMount');
    this.timer = setInterval(this.tick, 1000);
    this.tick();
  },

  tick: function() {
    console.log('Clock:tick');

    this.setState({
      remaining: get_time_remaining(this.props.start_time, this.props.end_time),
      elapsed: get_time_elapsed(this.props.start_time, this.props.end_time)
    });

  },

  render: function() {

    var start_time = this.props.start_time ? this.props.start_time : null;
    var end_time = this.props.end_time ? this.props.end_time : null;

    if (!this.state.remaining || !this.state.elapsed) {
      console.log('Clock: not rendered');
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

function start_timers(start, end) {
  console.log('start_timers: start = %o, end = %o', start, end);

  var container = $('#container');
  var target = $(container).get(0);

  React.render(<Clock start_time={start} end_time={end} />, target);

}

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

function setup_timers(query) {
  console.log('setup_timers');
  if (query.s && query.e) {
    console.log('onload: q = %o, e = %o', query.s, query.e);
    start_timers((query.s), (query.e));
  }
}

window.onload = function() {
  console.log('window:onload');

  var query = get_query_arguments();

  console.log('onload: query = %o', query);

  setup_timers(query);

  setup_control_panel(query);

};
