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

function encode_timestamp(timestamp) {
  var n = (timestamp).toString(36);
  return n;
}

function decode_timestamp(timestamp) {
  return parseInt(timestamp, 36);
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
      units: ['h', 'm'],
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

function start(start, end) {
  console.log('start: start = %o, end = %o', start, end);

  var container = $('#container');
  var target = $(container).get(0);

  React.render(<Clock start_time={start} end_time={end} />, target);

}

function setup() {
  $('#save').on('click', function(event){
    var duration = $('#duration').val();

    // offset
    // by default offset = 0; otherwise it will move the start_time backwards in time
    var offset = $('#offset').val();
    var start = get_now() - (offset * 60 * 1000);

    var end = start + (duration * 60 * 1000)

    var hash = 'd=' + duration + '&e=' + end + '&s=' + start;
    window.location.hash = hash;
    location.reload();
  });
}

window.onload = function() {
  console.log('window:onload');

  var query = get_query_arguments();

  console.log('onload: query = %o', query);

  if (query.s && query.e) {
    console.log('onload: q = %o, e = %o', query.s, query.e);
    start((query.s), (query.e));
  }

  setup();

};
