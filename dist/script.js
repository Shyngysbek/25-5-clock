import React from 'https://cdn.skypack.dev/react@17.0.2';
import ReactDOM from 'https://cdn.skypack.dev/react-dom@17.0.2';

$(document).ready(function () {// the function runs when the HTML document has been fully uploaded from the server to avoid bugs.
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
    let { handleBreakIncrement, handleBreakDecrement, breakLength } = this.props;
    return /*#__PURE__*/(
      React.createElement("div", { className: "break-length-box" }, /*#__PURE__*/
      React.createElement("h2", { id: "break-label" }, "Break Length"), /*#__PURE__*/
      React.createElement("button", { id: "break-increment", onClick: handleBreakIncrement }, "Break Increment"), /*#__PURE__*/
      React.createElement("h3", { id: "break-length" }, breakLength), /*#__PURE__*/
      React.createElement("button", { id: "break-decrement", onClick: handleBreakDecrement }, "Break Decrement")));


  }}


class Session extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { handleSessionIncrement, handleSessionDecrement, sessionLength } = this.props;
    return /*#__PURE__*/(
      React.createElement("div", { className: "session-length-box" }, /*#__PURE__*/
      React.createElement("h2", { id: "session-label" }, "Session Length"), /*#__PURE__*/
      React.createElement("button", { id: "session-increment", onClick: handleSessionIncrement }, "Session Increment"), /*#__PURE__*/
      React.createElement("h3", { id: "session-length" }, sessionLength), /*#__PURE__*/
      React.createElement("button", { id: "session-decrement", onClick: handleSessionDecrement }, "Session Decrement")));


  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timingType: "Session",
      timerPlay: false,
      timeLeft: 1500 };

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
    let seconds = this.state.timeLeft - minutes * 60;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  handleBreakIncrement() {
    if (this.state.breakLength < 60) {
      this.setState(state => ({
        breakLength: state.breakLength + 1 }));

    }
  }
  handleBreakDecrement() {
    if (this.state.breakLength > 1) {
      this.setState(state => ({
        breakLength: state.breakLength - 1 }));

    }
  }
  handleSessionIncrement() {
    if (this.state.sessionLength < 60) {
      this.setState(state => ({
        sessionLength: state.sessionLength + 1,
        timeLeft: state.timeLeft + 60 }));

    }
  }
  handleSessionDecrement() {
    if (this.state.sessionLength > 1) {
      this.setState(state => ({
        sessionLength: state.sessionLength - 1,
        timeLeft: state.timeLeft - 60 }));

    }
  }
  handlePlay() {
    //turn off OR turn on
    this.setState(state => ({
      timerPlay: !state.timerPlay }));

  }

  handleReset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timingType: "Session",
      timerPlay: false,
      timeLeft: 1500 });

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
        if (this.state.timerPlay && this.state.timeLeft) {
          this.setState(state => ({
            timeLeft: state.timeLeft - 1 }));

        }
      }, 1000);
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
    if (!this.state.timeLeft && round) {
      setTimeout(() => {
        this.audioPlay();
        this.setState(state => ({
          timingType: "Take a break",
          timeLeft: state.breakLength * 60 }));

        round = false;
      }, 1000);

    } else if (!this.state.timeLeft && !round) {
      setTimeout(() => {
        this.audioPlay();
        this.setState(state => ({
          timingType: "Session has begun",
          timeLeft: state.sessionLength * 60 }));

        round = true;
      }, 1000);

    }

    return /*#__PURE__*/(
      React.createElement("div", { className: "main" }, /*#__PURE__*/
      React.createElement("div", { className: "wrapper" }, /*#__PURE__*/
      React.createElement("h1", { className: "title" }, "25 + 5 Clock"), /*#__PURE__*/
      React.createElement("div", { className: "break-session-box" }, /*#__PURE__*/
      React.createElement("div", { className: "col-md-6" }, /*#__PURE__*/
      React.createElement(Break, { handleBreakIncrement: this.handleBreakIncrement, handleBreakDecrement: this.handleBreakDecrement, breakLength: this.state.breakLength })), /*#__PURE__*/

      React.createElement("div", { className: "col-md-6" }, /*#__PURE__*/
      React.createElement(Session, { handleSessionIncrement: this.handleSessionIncrement, handleSessionDecrement: this.handleSessionDecrement, sessionLength: this.state.sessionLength }))), /*#__PURE__*/



      React.createElement("div", { className: "session-timer bg-light" }, /*#__PURE__*/
      React.createElement("h2", { id: "timer-label" }, this.state.timingType), /*#__PURE__*/
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("span", { id: "time-left" }, this.timeFormatter()))), /*#__PURE__*/


      React.createElement("div", { className: "timer-controller" }, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.handlePlay }, "Start/Stop"), /*#__PURE__*/
      React.createElement("button", { id: "reset", onClick: this.handleReset }, "Reset"), /*#__PURE__*/
      React.createElement("audio", { id: "beep", src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav", preload: "auto" })))));




  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));