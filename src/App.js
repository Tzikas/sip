import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as SIP from 'sip.js'
import { ninvoke } from 'q';
console.log('SIP', SIP, 'SIP')


class App extends Component {

  state = {
    sounds: [
      './sound.mp3',
    ],
    number: null
  }

  componentDidMount(){
    createSimple()
  }

  play = (num) => {

    var audio = document.createElement('audio');
    audio.src = this.state.sounds[num] //'alarm.mp3'
    audio.play();
  }

  typingNumb = (e) => {
    console.log(e.target.value)
    let num = e.target.value.split('').pop()
    console.log('last num',num)
    this.play(num)
    this.setState({
      number:e.target.value
    })
  }

  
  render() {
    return (
      <div className="App">
        <video  id="remoteVideo"></video>
        <video  id="localVideo" muted="muted"></video>
        <input type="text" name="phone" onChange={this.typingNumb}/>
        <button onClick={()=>this.play(0)} id="buttonId">0</button>
        <button onClick={()=>this.play(1)} id="">1</button>
        <button onClick={()=>this.play(2)} id="">2</button>
      </div>
    );
  }
}









function createSimple() {
  var remoteVideoElement = document.getElementById('remoteVideo');
  var button = document.getElementById('buttonId');

  var configuration = {
    media: {
        remote: {
            video: remoteVideoElement,
            // Need audio to be not null to do audio & video instead of just video
            audio:  remoteVideoElement
        }
    },
    ua: {
      traceSip: true,
      uri: '102@192.168.125.16',
      wsServers: 'wss://192.168.125.16:8089/ws',
      authorizationUser: '102',
      password: 'password',
      displayName: "WebRTC"
    }
};

  var simple = new SIP.Web.Simple(configuration);

  // Adjust the style of the demo based on what is happening
  simple.on('ended', function() {
      remoteVideoElement.style.visibility = 'hidden';
      button.firstChild.nodeValue = 'video';
  });

  simple.on('connected', function() {
      remoteVideoElement.style.visibility = 'visible';
      button.firstChild.nodeValue = 'hang up';
  });

  simple.on('ringing', function() {
    simple.answer();
  });

  button.addEventListener('click', function() {
      // No current call up
      if (simple.state === SIP.Web.Simple.C.STATUS_NULL ||
          simple.state === SIP.Web.Simple.C.STATUS_COMPLETED) {
          simple.call('100@192.168.125.16');
      } else {
          simple.hangup();
      }
  });

  return simple;
}

export default App;
