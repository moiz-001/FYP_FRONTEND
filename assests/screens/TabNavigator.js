import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View } from 'react-native';
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyLands from './LandScreen';
import Activity from './Activity';
import Home from './Home';
import Chat from './ChatHistory';
import Setting from './Setting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchFarmerLand from './SearchFarmerLand';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation, route }) => {
    const id = route.params.id;
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route, navigation }) => ({
                headerShown: true,
                headerTitle: route.name,
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#1ED760',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                },
                headerTitleAlign: 'center',
                headerLeft: () => null,
                headerRight: () => {
                    if (route.name === 'Home') {
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notify', { id: id })}
                                style={{ marginRight: 15 }}
                            >
                                <VectorIcon name="bell-outline" size={24} color="#1E90FF" />
                            </TouchableOpacity>
                        );
                    } else if (route.name === 'Settings') {
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                                style={{ marginRight: 15 }}
                            >
                                <VectorIcon name="logout" size={24} color="#1E90FF" />
                            </TouchableOpacity>
                        );
                    }
                    return null;
                },

                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'My Lands') {
                        iconName = 'tree-outline';
                    } else if (route.name === 'My Activity') {
                        iconName = 'calendar-check';
                    } else if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Chat') {
                        iconName = 'chat-outline';
                    } else if (route.name === 'Settings') {
                        iconName = 'cog-outline';
                    }

                    return <VectorIcon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#1E90FF",
                tabBarInactiveTintColor: "#1ED760",
                tabBarStyle: {
                    height: 55,
                },
            })}
        >
            <Tab.Screen name="My Lands" component={MyLands} initialParams={{ id: id }} />
            <Tab.Screen name="My Activity" component={Activity} initialParams={{ id: id }} />
            <Tab.Screen name="Home" component={Home} initialParams={{ id: id }} />
            <Tab.Screen name="Chat" component={Chat} initialParams={{ id: id }} />
            <Tab.Screen name="Settings" component={Setting} initialParams={{ id: id }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;