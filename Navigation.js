import Authentication from './Authentication';
import Posts from "./Posts";
import {createDrawerNavigator, createAppContainer} from 'react-navigation';

const DrawerNavigator = createDrawerNavigator({
    Posts: {
        screen: Posts
    }
}, {
    defainitialRouteName: Posts
});

export default createAppContainer(DrawerNavigator);