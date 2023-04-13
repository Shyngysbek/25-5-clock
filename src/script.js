import React from 'https://cdn.skypack.dev/react@17.0.2'
import ReactDOM from 'https://cdn.skypack.dev/react-dom@17.0.2'

$(document).ready(function() { // the function runs when the HTML document has been fully uploaded from the server to avoid bugs.
  $(".session-timer, .title, .timer-controller").addClass("text-center");
  $("button").addClass("btn btn-primary btn-block");
  $("h2").addClass("text-nowrap");
  $("#session-label, #break-label, #break-length, #session-length, #time-left").addClass("text-center");
  $("#time-left").addClass("font-weight-bold");
  $("#time-left").css("fontSize", "45px");
  //$(".session-length-box, .break-length-box").css("width", "50%");
  $(".wrapper").css("width", "500px");
});

let round = true;

class Break extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {handleBreakIncrement, handleBreakDecrement, breakLength} = this.props;
    return (
      <div className="break-length-box">
        <h2 id="break-label">Break Length</h2>
        <button id="break-increment" onClick={handleBreakIncrement}>Break Increment</button>
        <h3 id="break-length">{breakLength}</h3>
        <button id="break-decrement" onClick={handleBreakDecrement}>Break Decrement</button>
      </div>
    );
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {handleSessionIncrement, handleSessionDecrement, sessionLength} = this.props;
    return (
      <div className="session-length-box">
        <h2 id="session-label">Session Length</h2>
        <button id="session-increment" onClick={handleSessionIncrement}>Session Increment</button>
        <h3 id="session-length">{sessionLength}</h3>
        <button id="session-decrement" onClick={handleSessionDecrement}>Session Decrement</button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      breakLength: 5,
      sessionLength: 25,
      timingType: "Session",
      timerPlay: false,
      timeLeft: 1500
    };
    this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
    this.timeFormatter = this.timeFormatter.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  timeFormatter() {
    let minutes = Math.floor(this.state.timeLeft / 60);
    let seconds = this.state.timeLeft - (minutes * 60);
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  handleBreakIncrement() {
    if(this.state.breakLength < 60) {
      this.setState((state)=>({
        breakLength: state.breakLength + 1
      }));
    }
  }
  handleBreakDecrement() {
    if(this.state.breakLength > 1) {
      this.setState((state)=>({
        breakLength: state.breakLength - 1
      }));
    }
  }
  handleSessionIncrement() {
    if(this.state.sessionLength < 60) {
      this.setState((state)=>({
        sessionLength: state.sessionLength + 1,
        timeLeft: state.timeLeft + 60
      }));
    }
  }
  handleSessionDecrement() {
    if(this.state.sessionLength > 1) {
      this.setState((state)=>({
        sessionLength: state.sessionLength - 1,
        timeLeft: state.timeLeft - 60
      }));
    }
  }
  handlePlay() {
    //turn off OR turn on
    this.setState(state => ({
      timerPlay: !state.timerPlay
    }));
  }
  
  handleReset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timingType: "Session",
      timerPlay: false,
      timeLeft: 1500
    });
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }
  audioPlay() {
    const audio = document.getElementById("beep");
    audio.play();
  }
  // componentDidMount() {
  //   this.myInterval = setInterval(() => {
  //     if(this.state.timerPlay && this.state.timeLeft) {
  //       this.setState(state => ({
  //           timeLeft: state.timeLeft - 1
  //       }));
  //     }
  //   }, 1000)
  // }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.timerPlay == false && this.state.timerPlay == true) {
      this.myInterval = setInterval(() => {
      if(this.state.timerPlay && this.state.timeLeft) {
        this.setState(state => ({
            timeLeft: state.timeLeft - 1
        }));
      }
    }, 1000)
      console.log('resumed');
    }
    if (prevState.timerPlay == true && this.state.timerPlay == false) {
      clearInterval(this.myInterval);
      console.log('paused');
    }
  }
  componentWillUnmount() {
    clearInterval(this.myInterval);
  }
  render() {
    if(!this.state.timeLeft && round) {
      setTimeout(() => {
      this.audioPlay();
      this.setState(state => ({
      timingType: "Take a break",
      timeLeft: state.breakLength * 60
      }));
      round = false;
      }, 1000);
      
    } else if(!this.state.timeLeft && !round) {
      setTimeout(() => {
      this.audioPlay();
      this.setState(state => ({
      timingType: "Session has begun",
      timeLeft: state.sessionLength * 60
      }));
      round = true;
      }, 1000);
      
    }
    
    return (
      <div className="main">
        <div className="wrapper">
          <h1 className="title">25 + 5 Clock</h1>
          <div className="break-session-box">
            <div className="col-md-6">
              <Break handleBreakIncrement={this.handleBreakIncrement} handleBreakDecrement={this.handleBreakDecrement} breakLength={this.state.breakLength}/>
            </div>
            <div className="col-md-6">
              <Session handleSessionIncrement={this.handleSessionIncrement} handleSessionDecrement={this.handleSessionDecrement} sessionLength={this.state.sessionLength}/>
            </div>
          </div>
          
          <div className="session-timer bg-light">
            <h2 id="timer-label">{this.state.timingType}</h2>
            <div>
              <span id="time-left">{this.timeFormatter()}</span>
            </div>
          </div>
          <div className="timer-controller">
            <button id="start_stop" onClick={this.handlePlay}>Start/Stop</button>
            <button id="reset" onClick={this.handleReset}>Reset</button>
            <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" preload="auto"/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));