import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import playbackService from './services/playbackService';
import playerHandler from './services/playerHandler';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
TrackPlayer.registerPlaybackService(playbackService);
TrackPlayer.registerEventHandler(playerHandler);
