import React, {useRef, useEffect, useState} from 'react';

const Video = (props) => {
  const { room, user, socket } = props;
  const localVideoRef = useRef(null);
  const remoteVideoRef= useRef(null);
  const titleRef= useRef(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };
  let pc;

  useEffect(() => {
    
  }, []);

  useEffect(() => {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video:{
          width: {
            max: 250
          }
        }
      })
      .then(gotStream)
      .catch(function(e) {
        alert('getUserMedia() error: ' + e.name);
      });
  }, [isInitiator]);

  function gotStream(stream) {
    console.log('Adding local stream.', stream);
    localVideoRef.current.srcObject = stream;

    socket.emit('STREAM', {userName: user.name, roomName: room.name, type: 'got user media'});

    socket.on('STREAM', data => {
      //data = {roomName, userName, type}
      titleRef.current.textContent = data.userName + ' is streaming...';
      
      if (data.type === 'got user media') {
        start(stream);
      } else if (data.type ===  'candidate' ) {
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: data.label,
          candidate: data.candidate
        });
        pc.addIceCandidate(candidate);
      } else if (data.type === 'answer') {
        pc.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.type === 'offer') {
          if (!isInitiator) {
            start(stream);
          }
        
          pc.setRemoteDescription(new RTCSessionDescription(data));
          pc.createAnswer().then(setLocalAndSendMessage, handleCreateDescriptionError);//doAnswer
          console.log('DESCRIPTION ', data);
      }
    })
    if (isInitiator) {
      start();
    }
  }

  function start(stream) {
    console.log('>>>>>>> maybeStart() ');
    createPeerConnection();
    pc.addStream(stream);
    console.log('isInitiator', isInitiator);
    if (isInitiator) {
      pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);//do call
    }
  }

  function createPeerConnection() {
    try {
      pc = new RTCPeerConnection(null);
      pc.onicecandidate = (event) => {
        console.log('icecandidate event: ', event);
        if (event.candidate) {
          socket.emit('STREAM', {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            room: room.name
          });
        } else {
          console.log('End of candidates.');
        }
      };
      pc.onaddstream = event => {
        console.log('-------------------adding stream to container', event.stream);
        const remoteStream = event.stream;
        remoteVideoRef.current.srcObject = remoteStream;
      };
      //pc.onremovestream = handleRemoteStreamRemoved;
      console.log('Created RTCPeerConnnection');
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object.');
      return;
    }
  }
  

  function setLocalAndSendMessage  (sessionDescription)  {
    pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    console.log("PC", pc);
    socket.emit('STREAM', sessionDescription);
  }

  function handleCreateOfferError (event)  {
    console.log('createOffer() error: ', event);
  }
  function handleCreateDescriptionError(error) {
   console.log('Failed to create session description: ' + error.toString());
  } 

  


  return (
    <div>
      <button onClick={() => setIsInitiator(true)} type="button">Stream</button>
      <button type="button">Stop</button>
      <div ref={titleRef}></div>
      <video ref={localVideoRef} id="localVideo" autoPlay muted></video>
      <video ref={remoteVideoRef} id="remoteVideo" autoPlay ></video>
    </div>
  )
}

export default Video;