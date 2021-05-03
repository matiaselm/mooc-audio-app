import TrackPlayer from 'react-native-track-player';

export default async (data) => {
    if (data.type == 'playback-state') {
        console.log('playback-state', data);
        // Update the UI with the new state
    } else if (data.type == 'remote-play') {
        console.log('remote-play', data);
        // The play button was pressed, we can forward this command to the player using
        TrackPlayer.play();
    } else if (data.type == 'remote-pause') {
        console.log('remote-pause', data);
        // The play button was pressed, we can forward this command to the player using
        TrackPlayer.pause();
    } else if(data.type == 'remote-stop') {
        console.log('remote-stop', data);
        TrackPlayer.destroy();
    } 
};