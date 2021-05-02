export default async (data) => {
    if (data.type == 'playback-state') {
        // console.log('playback-state', data);
        // Update the UI with the new state
    } else if (data.type == 'remote-play') {
        // console.log('remote-play', data);
        // The play button was pressed, we can forward this command to the player using
        //TrackPlayer.play();
    } else if (data.type == 'remote-seek') {
        // console.log('remote-seek', data);
        // Again, we can forward this command to the player using
        //TrackPlayer.seekTo(data.position);
    }
    // ...
};