import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import ViewLand from './ViewLand';

const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
            <View style={styles.topSection}>
                <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                    <Icon source="chevron-right" size={30} color="#1E90FF" />
                </TouchableOpacity>
            </View>

            <View style={styles.contentSection}>
                <Text style={styles.drawerTitle}>{props.landName}</Text>
                <View style={styles.separator} />

                <TouchableOpacity style={styles.drawerBtn} onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('AddCrop', { id: props.landId });
                }}>
                    <Text style={styles.drawerBtnText}>Add Crop</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerBtn} onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('CropHistory', { land_id: props.landId, title: props.landName + " Crops History" });
                }}>
                    <Text style={styles.drawerBtnText}>View Crops History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerBtn} onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('AddNeighbour');
                }}>
                    <Text style={styles.drawerBtnText}>Add Neighbour</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ route }) => {
    const landName = route.params?.land || 'Land';
    const landId = route.params?.land_id;
    const fid = route.params?.fid;


    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} landName={landName} landId={landId} fid={fid} />}
            screenOptions={{
                headerShown: false,
                drawerPosition: 'right',
                drawerStyle: { width: '70%' },
            }}
        >
            <Drawer.Screen
                name="ViewLandContent"
                component={ViewLand}
                initialParams={{ land: landName, land_id: landId, fid: fid }}
            />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topSection: {
        padding: 10,
        alignItems: 'flex-start',
    },
    contentSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    drawerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1ED760",
        marginVertical: 10,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#B3E5FC',
        marginBottom: 30,
    },
    drawerBtn: {
        backgroundColor: "#1ED760",
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 10,
    },
    drawerBtnText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    }
});

export default DrawerNavigator;
