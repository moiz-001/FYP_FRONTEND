import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Icon } from "react-native-paper";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { getLandsbyFarmerName } from '../api';

const SearchFarmerLand = ({ navigation, route }) => {
    const { fid = route.params?.id } = route.params || {};
    const [landsData, setLandsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const swipeableRefs = new Map();







    const searchLandsByFarmer = async () => {
        if (!searchQuery.trim()) {
            Alert.alert("Enter farmer name");
            return;
        }

        try {
            setLoading(true);
            const response = await getLandsbyFarmerName(searchQuery.trim());

            const transformedData = response.map((land, index) => ({
                id: land.land_id || index,
                name: land.land_name,
                acres: `${land.land_in_acres} ACRES`,
                location: `${land.landMark || ""}, ${land.city_Name || ""}`,
                waterSource: land.source_of_water,
                soil_type: land.soil_type,
                years_of_cultivation: land.years_of_cultivation,
                landmark: land.landMark,
                city_name: land.city_Name,
                land_id: land.land_id
            }));

            setLandsData(transformedData);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Farmer not found");
        } finally {
            setLoading(false);
        }
    };

    const renderLandItem = ({ item }) => (
        <View style={{ flex: 1 }}>
            <View
                style={styles.landCard}

            >
                <View style={styles.landHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={styles.landName}>{item.name}</Text>
                        <Text style={styles.acresText}>{item.acres}</Text>
                    </View>
                </View>

                <View style={styles.landDetails}>
                    <View style={styles.detailRow}>
                        <Icon source="map-marker-outline" size={hp('2.5%')} color="#939793" />
                        <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                    <Text style={styles.waterSourceText}>{item.waterSource}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <Icon source="magnify" size={hp('3%')} color="#ccc" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Farmer Name"
                    placeholderTextColor="#ccc"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={searchLandsByFarmer}
                />
                {loading && (
                    <ActivityIndicator size="small" color="#1ED760" />
                )}
            </View>

            <FlatList
                data={landsData}
                renderItem={renderLandItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No matching lands found' : 'Enter a farmer name to search'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: hp('2%'),
        fontSize: hp('2%'),
        color: '#666',
    },
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        height: hp('8%'),
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp('2.5%'),
    },
    backBtn: {
        padding: wp('1.5%'),
    },
    headerTitle: {
        fontSize: hp('3.2%'),
        fontWeight: "bold",
        color: "#1ED760",
        textAlign: "center",
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: wp('5%'),
        marginVertical: hp('2%'),
        paddingHorizontal: wp('3%'),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1ED760',
        height: hp('6%'),
    },
    searchInput: {
        flex: 1,
        paddingLeft: wp('2.5%'),
        fontSize: hp('2%'),
        color: '#333',
    },
    listContainer: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('12%'),
    },
    landCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: wp('5%'),
        marginBottom: hp('2%'),
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 3,
    },
    landHeader: {
        marginBottom: hp('1%'),
    },
    landName: {
        fontSize: hp('2.8%'),
        fontWeight: 'bold',
        color: '#444',
        marginRight: wp('2.5%'),
    },
    acresText: {
        fontSize: hp('1.8%'),
        color: '#999',
        fontWeight: '500',
    },
    landDetails: {
        gap: hp('0.6%'),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('-1%'),
    },
    locationText: {
        fontSize: hp('2%'),
        color: '#666',
        marginLeft: wp('1.5%'),
        flex: 1,
    },
    waterSourceText: {
        fontSize: hp('1.8%'),
        color: '#1E90FF',
        marginTop: hp('0.6%'),
    },
    rightActions: {
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('20%'),
        height: '80%',
        marginTop: '2%',
        borderRadius: 15,
        marginRight: wp('5%'),
    },
    editActionButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabButton: {
        position: 'absolute',
        bottom: hp('4%'),
        right: wp('5%'),
        backgroundColor: '#1ED760',
        width: wp('18%'),
        height: wp('18%'),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabText: {
        color: '#FFFFFF',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        lineHeight: hp('2.2%'),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('6%'),
    },
    emptyText: {
        fontSize: hp('2%'),
        color: '#999',
        marginTop: hp('1.2%'),
    },
    addFirstButton: {
        marginTop: hp('2%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
        backgroundColor: '#1ED760',
        borderRadius: 8,
    },
    addFirstButtonText: {
        color: '#FFFFFF',
        fontSize: hp('2%'),
        fontWeight: '600',
    },
});

export default SearchFarmerLand;