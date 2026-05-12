import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert
} from "react-native";
import { Icon } from "react-native-paper";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { getAllActivitiesOfFarmer, BASE_URL } from '../api';
import { useIsFocused } from '@react-navigation/native';

const Activity = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activities, setActivities] = useState([]);

    const farmerId = route.params?.id;
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchActivities = async () => {
            if (farmerId) {
                try {
                    const data = await getAllActivitiesOfFarmer(farmerId);
                    if (Array.isArray(data)) {
                        setActivities(data);
                    } else if (data && data.activities) {
                        setActivities(data.activities);
                    }
                } catch (error) {
                    Alert.alert("Failed to fetch activities:", error);
                }
            }
        };

        if (isFocused) {
            fetchActivities();
        }
    }, [farmerId, isFocused]);

    const swipeableRefs = new Map();

    const closeAllSwipeables = () => {
        swipeableRefs.forEach((ref) => {
            if (ref) ref.close();
        });
    };

    const renderRightActions = (item) => (
        <View style={styles.rightActions}>
            <TouchableOpacity
                style={styles.editAction}
                onPress={() => {
                    closeAllSwipeables();
                    navigation.navigate('AddActivity', { activity: item, id: farmerId });
                }}
            >
                <Icon source="pencil-outline" size={hp('3%')} color="#1ED760" />
            </TouchableOpacity>
        </View>
    );

    const filteredActivities = activities.filter(activity => {
        const cropName = activity["Crop Name"] ? String(activity["Crop Name"]).toLowerCase() : '';
        const landName = activity["Land Name"] ? String(activity["Land Name"]).toLowerCase() : '';
        const search = searchQuery.toLowerCase();
        return cropName.includes(search) || landName.includes(search);
    });

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return { uri: imagePath };
        return { uri: `${BASE_URL}/${imagePath}` };
    };

    const renderActivityItem = ({ item }) => (
        <GestureHandlerRootView>
            <Swipeable
                ref={ref => {
                    if (ref) swipeableRefs.set(item.Performed_id, ref);
                }}
                renderRightActions={() => renderRightActions(item)}
                onSwipeableWillOpen={() => {
                    swipeableRefs.forEach((ref, key) => {
                        if (key !== item.Performed_id && ref) ref.close();
                    });
                }}
            >
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.imageBox}>
                            {item["Crop Image"] ? (
                                <Image source={getImageUrl(item["Crop Image"])} style={styles.cropImage} />
                            ) : (
                                <Icon source="sprout" size={hp('3.5%')} color="#1ED760" />
                            )}
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.cropName}>{item["Crop Name"] || 'Unknown Crop'}</Text>
                            <Text style={styles.landName}>{item["Land Name"] || 'Unknown Land'}</Text>
                            <Text style={styles.details}>{item["Activity Name"]} | {item["Quantity Per Acre"]} per acre</Text>
                            <Text style={styles.date}>{item["Activity Date"]}</Text>
                        </View>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <Icon source="magnify" size={hp('3%')} color="#ccc" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Activity"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredActivities}
                renderItem={renderActivityItem}
                keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon source="calendar-blank" size={hp('6%')} color="#ccc" />
                        <Text style={styles.emptyText}>No activities found</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    closeAllSwipeables();
                    navigation.navigate('AddActivity', { id: farmerId });
                }}
            >
                <Text style={styles.fabText}>Add</Text>
                <Text style={styles.fabText}>Activity</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: wp('5%'),
        marginVertical: hp('2%'),
        paddingHorizontal: wp('4%'),
        borderRadius: 10,
        height: hp('5.5%'),
        elevation: 2,
        borderWidth: 1,
        borderColor: '#1ED760',
    },
    searchInput: {
        flex: 1,
        marginLeft: wp('2.5%'),
        fontSize: hp('2%'),
    },
    listContainer: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('12%'),
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: hp('2%'),
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        padding: wp('3%'),
        alignItems: 'center',
    },
    imageBox: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('4%'),
    },
    cropImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    infoBox: {
        flex: 1,
    },
    cropName: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        color: '#333',
    },
    landName: {
        fontSize: hp('1.8%'),
        color: '#1ED760',
        fontWeight: '600',
        marginTop: hp('0.25%'),
    },
    details: {
        fontSize: hp('1.8%'),
        color: '#666',
        marginTop: hp('0.25%'),
    },
    date: {
        fontSize: hp('1.5%'),
        color: '#999',
        marginTop: hp('0.5%'),
    },
    rightActions: {
        flexDirection: 'row',
        marginBottom: hp('2%'),
        borderRadius: 12,
        overflow: 'hidden',
        marginLeft: wp('2.5%'),
    },
    editAction: {
        backgroundColor: '#f0fbf2',
        width: wp('20%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteAction: {
        backgroundColor: '#fff1f1',
        width: wp('15%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: hp('2.5%'),
        right: wp('5%'),
        backgroundColor: '#1ED760',
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabText: {
        color: '#fff',
        fontSize: hp('1.8%'),
        fontWeight: 'bold',
        lineHeight: hp('2%'),
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: hp('12%'),
    },
    emptyText: {
        fontSize: hp('2%'),
        color: '#999',
        marginTop: hp('1.2%'),
    },
});

export default Activity;
