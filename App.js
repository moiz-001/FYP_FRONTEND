import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Intro from "./assests/screens/Intro";
import Login from "./assests/screens/Login";
import Signup from "./assests/screens/Signup";
import Home from "./assests/screens/Home";
import Notification from "./assests/screens/Notification";
import TabNavigator from "./assests/screens/TabNavigator";
import Setting from "./assests/screens/Setting";
import AddLand from "./assests/screens/AddLand";
import AddActivity from "./assests/screens/AddActivity";
import AddNeighbour from "./assests/screens/AddNeighbour";
import MyLands from "./assests/screens/LandScreen";
import DrawerNavigator from "./assests/screens/DrawerNavigator";
import Chat from "./assests/screens/ChatScreen";
import ChatHistory from "./assests/screens/ChatHistory";
import AddCrop from "./assests/screens/AddCrop";
import ViewCrop from "./assests/screens/ViewCrop";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ViewLand from "./assests/screens/ViewLand";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Notify" component={Notification} />
          <Stack.Screen name="AddLand" component={AddLand} />
          <Stack.Screen name="ViewLand" component={DrawerNavigator} />
          <Stack.Screen name="AddActivity" component={AddActivity} />
          <Stack.Screen name="AddNeighbour" component={AddNeighbour} />
          <Stack.Screen name="MyLands" component={MyLands} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="ChatHistory" component={ChatHistory} />
          <Stack.Screen name="ChatScreen" component={Chat} />
          <Stack.Screen name="AddCrop" component={AddCrop} />
          <Stack.Screen name="CropHistory" component={ViewCrop} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;