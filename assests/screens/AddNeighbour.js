import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Icon } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchNeighbouringLands, addNeighbour, BASE_URL } from '../api';

const AddNeighbour = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (searchQuery.trim().length === 0) return;
        setLoading(true);
        try {
            const selectedLandId = await AsyncStorage.getItem('selectedLandId');
            if (!selectedLandId) {
                Alert.alert("Error", "No land selected. Please go back and select a land first.");
                setLoading(false);
                return;
            }

            const payload = {
                id: selectedLandId,
                phone: searchQuery.trim()
            };

            const results = await searchNeighbouringLands(payload);
            if (Array.isArray(results) && results.length > 0) {
                setSearchResults(results);
                setShowResults(true);
            } else {
                Alert.alert("Not Found", "No public lands found for this phone number in your city.");
                setShowResults(false);
            }
        } catch (error) {
            console.log("Search Error:", error);
            if (error && error.message === 'Land not found') {
                Alert.alert("Not Found", "No public lands found for this phone number.");
                setShowResults(false);
            } else {
                Alert.alert("Error", typeof error === 'string' ? error : (error.message || "Failed to search neighbours"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddNeighbour = async (neighbourLandId) => {
        try {
            const selectedLandId = await AsyncStorage.getItem('selectedLandId');
            if (!selectedLandId) return;

            const payload = {
                land_id: selectedLandId,
                neighbour_land_id: neighbourLandId
            };

            const res = await addNeighbour(payload);
            Alert.alert("Success", "Neighbour request sent successfully.");
            navigation.goBack();
        } catch (error) {
            console.error("Add Error:", error);
            Alert.alert("Error", typeof error === 'string' ? error : "Failed to send request.");
        }
    };

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={hp('3%')} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Add Neighbour</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.searchContainer}>
                    <Icon source="magnify" size={hp('3%')} color="#4CAF50" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search your Neighbour..."
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text === '') setShowResults(false);
                        }}
                        keyboardType="number-pad"
                    />
                </View>

                {!showResults && (
                    <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchBtnText}>Search Neighbour</Text>}
                    </TouchableOpacity>
                )}

                {showResults && searchResults.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.avatarPlaceholder}>
                                {item.Farmer_Image ? (
                                    <Image source={{ uri: item.Farmer_Image }} style={{width: '100%', height: '100%', borderRadius: 50}} />
                                ) : (
                                    <Icon source="account-circle" size={wp('10%')} color="#4CAF50" />
                                )}
                            </View>
                            <View style={styles.nameSection}>
                                <Text style={styles.neighbourName}>{item.Farmer_Name}</Text>
                                <View style={styles.phoneRow}>
                                    <Icon source="phone" size={hp('2%')} color="#1E90FF" />
                                    <Text style={styles.phoneText}>{item.Phone}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.detailsSection}>
                            <View style={styles.detailRow}>
                                <Icon source="terrain" size={hp('2.2%')} color="#4CAF50" />
                                <Text style={styles.detailText}>Land: {item.Land_Name}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Icon source="map-marker" size={hp('2.2%')} color="#F44336" />
                                <Text style={styles.detailText}>Location: {item.LandMark || "N/A"}</Text>
                            </View>
                        </View>

                        {item.Crop_Name && (
                            <View style={styles.cropBox}>
                                <Image
                                    source={item.Crop_Image ? { uri: item.Crop_Image } : require('../images/uploads/crops/Rabi/Brinjal.jpg')}
                                    style={styles.cropImage}
                                />
                                <View style={styles.cropInfo}>
                                    <Text style={styles.cropName}>{item.Crop_Name}</Text>
                                    <View style={styles.waterRow}>
                                        <Icon source="circle" size={hp('1%')} color="#1E90FF" />
                                        <Text style={styles.waterText}>Water: {item.Source_Of_Water || "N/A"}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity style={styles.addBtn} onPress={() => handleAddNeighbour(item.Land_id)}>
                            <Icon source="plus" size={hp('2.5%')} color="#fff" />
                            <Text style={styles.addBtnText}>Add Neighbour</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default AddNeighbour;

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: "#FBFBFF" },
    header: {
        flexDirection: "row",
        height: hp('8%'),
        alignItems: "center",
        paddingHorizontal: wp('4%'),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: hp('3%'),
        fontWeight: "bold",
        color: "#4CAF50",
        flex: 1,
        textAlign: 'center',
        marginRight: wp('8%'),
    },
    scrollContent: {
        paddingBottom: hp('5%'),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: wp('4%'),
        paddingHorizontal: wp('4%'),
        borderRadius: 15,
        height: hp('7%'),
        borderWidth: 2,
        borderColor: '#1ED760',
    },
    searchInput: {
        flex: 1,
        marginLeft: wp('2.5%'),
        fontSize: hp('2.2%'),
    },
    searchBtn: {
        backgroundColor: '#1ED760',
        marginHorizontal: wp('15%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 25,
        alignItems: 'center',
        marginTop: hp('2%'),
        elevation: 2,
    },
    searchBtnText: {
        color: '#fff',
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: wp('5%'),
        marginHorizontal: wp('4%'),
        marginBottom: hp('3%'),
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1.5%'),
    },
    avatarPlaceholder: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    nameSection: {
        marginLeft: wp('4%'),
    },
    neighbourName: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        color: '#333',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.2%'),
    },
    phoneText: {
        marginLeft: wp('1.5%'),
        color: '#999',
        fontSize: hp('1.8%'),
    },
    detailsSection: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: hp('1.5%'),
        marginBottom: hp('1.5%'),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('0.8%'),
    },
    detailText: {
        marginLeft: wp('3%'),
        color: '#666',
        fontSize: hp('1.9%'),
    },
    cropBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: wp('2.5%'),
        marginBottom: hp('2.5%'),
    },
    cropImagePlaceholder: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 8,
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cropImage: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 8,
    },
    cropInfo: {
        marginLeft: wp('4%'),
    },
    cropName: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#333',
    },
    waterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.4%'),
    },
    waterText: {
        marginLeft: wp('1.5%'),
        color: '#888',
        fontSize: hp('1.6%'),
    },
    addBtn: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        borderRadius: 10,
    },
    addBtnText: {
        color: '#fff',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        marginLeft: wp('2%'),
    }
});