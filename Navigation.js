import Authentication from './Authentication';
import Posts from "./Posts";
import {createDrawerNavigator, createAppContainer} from 'react-navigation';
import Nearby from "./Nearby";

const DrawerNavigator = createDrawerNavigator({
    Posts: {
        screen: Posts
    },
    Nearby: {
        screen: Nearby
    }
}, {
    defainitialRouteName: Posts
});

export default createAppContainer(DrawerNavigator);