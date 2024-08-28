const socket = io('/');
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '5000'
});

const videoGrid = document.getElementById('remote-videos');
const localVideo = document.getElementById('local-video');
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(localVideo, stream);

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

    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close();
    });
});

peer.on('open', id => {
    const ROOM_ID = 'd1435c36-f1ab-49bd-b23a-48558c1db3ce'; // Set dynamically if needed
    socket.emit('join-room', ROOM_ID, id);
});

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
