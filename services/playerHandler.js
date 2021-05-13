import TrackPlayer from 'react-native-track-player';

export default async (data) => {
    switch(data.type){
        case 'playback-state': {
            console.log('playback-state', data);
            return
        }
        case 'remote-play': {
            console.log('remote-play', data);
            TrackPlayer.play();
            return
        }
        case 'remote-pause': {
            console.log('remote-pause', data);
            TrackPlayer.pause();
            return
        }
        case 'remote-stop': {
            console.log('remote-stop', data);
            TrackPlayer.destroy();
            return
        }
        case 'remote-skip': {
            console.log('remote-skip')
            console.log('remote-skip', data);
            return
        }
        default: {
            console.log('default')
            return
        }
    }
};