import React, { useState, useEffect } from 'react';
import { Container, ToastAndroid, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';
import TrackPlayer, { play } from 'react-native-track-player';

const PlayerInfo = ({ track }) => {
    const [trackTitle, setTrackTitle] = useState();
    useEffect(() => {
        let mounted = true;

        // Set the initial track title:
        (async () => {
            const trackId = await TrackPlayer.getCurrentTrack();
            if (!mounted || !trackId) return;
            const track = await TrackPlayer.getTrack(trackId);
            if (!mounted) return;
            setTrackTitle(track.title ?? 'no title :(');
        })();

        // Set the track title whenever the track changes:
        const listener = TrackPlayer.addEventListener(
            'playback-track-changed',
            async (data) => {
                const track = await TrackPlayer.getTrack(data.nextTrack);
                if (!mounted) return;
                setTrackTitle(track.title ?? 'no title :(');
            }
        );
        return () => {
            mounted = false;
            listener.remove();
        }
    }, []);

    return (
        <Text>{trackTitle ?? 'title'}</Text>
    );
}

export default PlayerInfo;
