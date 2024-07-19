const socket = io('/');
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '5000'
});

const videoGrid = document.getElementById('remote-videos');
const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    });
});

peer.on('open', id => {
    const ROOM_ID = window.location.pathname.substring(1);
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
});

const peers = {};
function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}
