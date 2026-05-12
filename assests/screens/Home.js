import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    Alert
} from "react-native";
import { Icon } from "react-native-paper";
import { getFarmer, getLands, getReminders, GetAllNeighboursWithLatestCrop, BASE_URL, accountdate } from "../api";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';

const { width: screenWidth } = Dimensions.get('window');

// Colors matching the Flutter AppColors
const AppColors = {
    primaryGreen: '#1ED760',
    blue: '#1E90FF',
    whiteText: '#FFFFFF',
    cardBg: '#FFFFFF',
    transparent: 'transparent',
    warningOrange: '#FFA500',
    greyText: '#888888',
    darkText: '#333333',
};

const Home = ({ navigation, route }) => {
    const farmerId = route.params?.id;

    const [landDetails, setLandDetails] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [remindersLoading, setRemindersLoading] = useState(false);
    const [farmer, setFarmer] = useState({});
    const [lands, setLands] = useState([]);
    const [cityName, setCityName] = useState(null);
    const [selectedLandId, setSelectedLandId] = useState(null);
    const [neighbours, setNeighbours] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedLandName, setSelectedLandName] = useState(null);
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageModalVisible, setImageModalVisible] = useState(false);

    const [date, setDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);



    const fetchFarmerData = async () => {
        if (!farmerId) return;
        try {
            const data = await getFarmer(farmerId);
            if (data) {
                setFarmer(data);
                const nameParts = (data.Name || "").trim().split(/\s+/);
                setFirstName(nameParts.length > 0 ? nameParts[0] : "");
            }
        } catch (error) {
            console.error("Error fetching farmer:", error);
        }
    };
    const setdate = async (dateValue) => {
        try {
            const payload = {
                farmer_id: farmerId,
                Prefered_Date: dateValue
            };
            await accountdate(JSON.stringify(payload));
        } catch (error) {
            console.error("Error setting account date:", error);

        }
    }

    const fetchAllLands = async () => {
        if (!farmerId) return;
        try {
            const data = await getLands(farmerId);
            if (data && data.length > 0) {
                setLandDetails(data);
                const landNames = data.map(e => e.land_name.toString());
                setLands(landNames);

                // Set initial selection
                setSelectedIndex(0);
                const initialLand = data[0];
                setSelectedLandName(initialLand.land_name);
                setSelectedLandId(initialLand.land_id);
                setCityName(initialLand.city_Name || initialLand.city_name);

                // Save to AsyncStorage for AddNeighbour
                await AsyncStorage.setItem('selectedLandId', initialLand.land_id.toString());

                // Trigger subsequent fetches
                fetchRemindersData(initialLand.land_id);
                fetchNeighboursData(initialLand.land_id);
                fetchWeatherData(initialLand.city_Name || initialLand.city_name);
            }
            setIsLoading(false);
        } catch (error) {
            Alert.alert("Error fetching lands:");
            setIsLoading(false);
        }
    };

    const fetchRemindersData = async (landId) => {
        setRemindersLoading(true);
        try {
            const data = await getReminders(landId);
            if (data && data.reminders) {
                setReminders(data.reminders);
            } else {
                setReminders([]);
            }
        } catch (error) {
            console.log('Error fetching reminders:', error);
            setReminders([]);
        } finally {
            setRemindersLoading(false);
        }
    };

    const fetchNeighboursData = async (landId) => {
        try {
            const response = await GetAllNeighboursWithLatestCrop(landId);
            if (response && Array.isArray(response)) {
                setNeighbours(response);
            } else {
                setNeighbours([]);
            }
        } catch (error) {
            console.error("Error fetching neighbours:", error);
            setNeighbours([]);
        }
    };

    const fetchWeatherData = async (city) => {
        if (!city) return;
        try {
            const url = `${BASE_URL}/getWeather/${encodeURIComponent(city)}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok && !data.error) {
                setWeather({
                    temp: data.temperature,
                    description: data.description,
                    humidity: data.humidity,
                    windSpeed: data.wind_speed,
                    main: data.raw_data?.weather?.[0]?.main || data.condition
                });
            } else {
                setWeather(null);
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFarmerData();
            fetchAllLands();
        }, [farmerId])
    );

    const handleLandSelection = async (index) => {
        setSelectedIndex(index);
        const selected = landDetails[index];
        setSelectedLandName(selected.land_name);
        setSelectedLandId(selected.land_id);
        const city = selected.city_Name || selected.city_name;
        setCityName(city);

        await AsyncStorage.setItem('selectedLandId', selected.land_id.toString());

        fetchRemindersData(selected.land_id);
        fetchNeighboursData(selected.land_id);
        fetchWeatherData(city);
    };

    if (isLoading) {
        return (
            <View style={ss.loadingCenter}>
                <ActivityIndicator size="large" color={AppColors.primaryGreen} />
            </View>
        );
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    return (
        <SafeAreaView style={ss.container}>
            <ScrollView contentContainerStyle={ss.scrollContent}>
                <View style={ss.paddingContainer}>
                    {/* Header Row */}
                    <View style={ss.headerRow}>
                        <View style={ss.greetContainer}>
                            <Text style={ss.hiText}>Hi, </Text>
                            <Text style={ss.nameText}>{firstName}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                            <Image
                                source={farmer.image ? { uri: farmer.image.startsWith('http') ? farmer.image : `${BASE_URL}/${farmer.image}` } : require("../images/bold.png")}
                                style={ss.profileImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity style={ss.inputBox} onPress={showDatePicker}>
                            <TextInput
                                style={ss.txtinpp}
                                placeholder="Activity Date"
                                value={date}
                                editable={false}
                                pointerEvents="none"
                            />
                            <Icon source="calendar-month-outline" size={10} color="#ccc" />
                        </TouchableOpacity>

                        <Modal isVisible={isDatePickerVisible} onBackdropPress={hideDatePicker}>
                            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                                <Calendar
                                    onDayPress={(day) => {
                                        const dateObj = new Date(day.dateString);
                                        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                        const dayName = days[dateObj.getDay()];
                                        const formattedDate = `${dayName}-${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
                                        setDate(formattedDate);
                                        hideDatePicker();
                                        setdate(formattedDate);
                                    }}
                                />
                                <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} onPress={hideDatePicker}>
                                    <Text style={{ color: '#1E90FF', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                    </View>

                    {/* Land Selector */}
                    <View style={ss.landSelectorContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {lands.map((land, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleLandSelection(index)}
                                    style={[
                                        ss.chip,
                                        selectedIndex === index ? ss.chipSelected : ss.chipUnselected
                                    ]}
                                >
                                    <Text style={[
                                        ss.chipText,
                                        selectedIndex === index ? ss.chipTextSelected : ss.chipTextUnselected
                                    ]}>
                                        {land}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Weather Card */}
                    <View style={ss.weatherCard}>
                        <View style={ss.weatherTop}>
                            <Text style={ss.weatherTemp}>
                                {weather ? `${weather.temp.toFixed(0)}° C` : "--° C"}
                            </Text>
                            <Text style={ss.weatherDesc}>
                                {weather ? weather.description : "Loading..."}
                            </Text>
                        </View>
                        <View style={ss.divider} />
                        <View style={ss.weatherBottom}>
                            <Text style={ss.weatherDetailText}>
                                Humidity: {weather ? weather.humidity : "--"}%
                            </Text>
                            <Text style={ss.weatherDetailText}>
                                Wind: {weather ? weather.windSpeed : "--"} km/h
                            </Text>
                            <Text style={ss.weatherMainText}>
                                {weather ? weather.main : ""}
                            </Text>
                        </View>
                    </View>

                    {/* Alerts Card */}
                    <View style={ss.alertsCard}>
                        <View style={ss.alertsHeader}>
                            <Icon source="bell-ring-outline" size={20} color="#fff" />
                            <Text style={ss.cardTitle}> Alerts for {selectedLandName}</Text>
                        </View>
                        <View style={[ss.divider, { backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 6 }]} />
                        <View style={ss.alertsList}>
                            {remindersLoading ? (
                                <View style={ss.alertsLoadingContainer}>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text style={ss.alertsLoadingText}>Checking reminders...</Text>
                                </View>
                            ) : reminders.length > 0 ? (
                                reminders.map((item, index) => (
                                    <View key={item.suggested_activity_id || index} style={ss.alertItem}>
                                        <View style={ss.alertItemLeft}>
                                            <Icon
                                                source={item.status === 'postponed' ? 'clock-alert-outline' : 'checkbox-blank-circle-outline'}
                                                size={18}
                                                color={item.status === 'postponed' ? '#FFD54F' : '#fff'}
                                            />
                                            <View style={ss.alertItemInfo}>
                                                <Text style={ss.alertActivityName}>{item.activity_name}</Text>
                                                <Text style={ss.alertWhen}>{item.when || item.day_count}</Text>
                                                {item.weather_note ? (
                                                    <View style={ss.alertWeatherRow}>
                                                        <Icon source="weather-lightning-rainy" size={12} color="#FFD54F" />
                                                        <Text style={ss.alertWeatherNote}>{item.weather_note}</Text>
                                                    </View>
                                                ) : null}
                                            </View>
                                        </View>
                                        <View style={[ss.alertStatusBadge, {
                                            backgroundColor: item.status === 'postponed' ? 'rgba(255,213,79,0.25)' : 'rgba(255,255,255,0.2)'
                                        }]}>
                                            <Text style={[ss.alertStatusText, {
                                                color: item.status === 'postponed' ? '#FFD54F' : '#fff'
                                            }]}>
                                                {item.status}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={ss.noDataText}>No upcoming alerts</Text>
                            )}
                        </View>
                    </View>

                    {/* Neighbors Card */}
                    <View style={ss.neighborsCard}>
                        <Text style={ss.cardTitle}>Neighbors</Text>
                        <View style={[ss.divider, { backgroundColor: '#fff', marginVertical: 4 }]} />

                        <View style={ss.neighborsContent}>
                            {neighbours.length === 0 ? (
                                <View style={ss.noNeighbours}>
                                    <Text style={ss.noNeighboursText}>No Neighbor</Text>
                                </View>
                            ) : (
                                <View style={ss.neighborsGrid}>
                                    {neighbours.map((item, index) => (
                                        <View key={index} style={ss.neighborItem}>
                                            <Text style={ss.neighborLandName} numberOfLines={1}>
                                                {item.land_name}
                                            </Text>

                                            <View style={ss.neighborRow}>
                                                <Image
                                                    source={item.farmer_image ? { uri: item.farmer_image.startsWith('http') ? item.farmer_image : `${BASE_URL}/${item.farmer_image}` } : require("../images/bold.png")}
                                                    style={ss.neighborAvatar}
                                                />
                                                <Text style={ss.neighborFarmerName} numberOfLines={1}>
                                                    {item.farmer_name}
                                                </Text>
                                            </View>

                                            <View style={ss.neighborRow}>
                                                <Image
                                                    source={item.Crop_image ? { uri: item.Crop_image.startsWith('http') ? item.Crop_image : `${BASE_URL}/${item.Crop_image}` } : require("../images/bold.png")}
                                                    style={ss.neighborAvatar}
                                                />
                                                <Text style={ss.neighborCropName} numberOfLines={1}>
                                                    {item.Crop || item.crop_name}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Profile Image Modal */}
            <Modal visible={isImageModalVisible} transparent={true} animationType="fade">
                <View style={ss.modalBackground}>
                    <TouchableOpacity style={ss.modalClose} onPress={() => setImageModalVisible(false)}>
                        <Icon source="close" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={farmer.image ? { uri: farmer.image.startsWith('http') ? farmer.image : `${BASE_URL}/${farmer.image}` } : require("../images/bold.png")}
                        style={ss.fullImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const ss = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    paddingContainer: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    greetContainer: {
        flexDirection: 'row',
    },
    hiText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: AppColors.blue,
    },
    nameText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: AppColors.primaryGreen,
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 16,
    },
    landSelectorContainer: {
        height: 50,
        marginBottom: 8,
    },
    chip: {

        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    chipSelected: {
        backgroundColor: AppColors.primaryGreen,
    },
    chipUnselected: {
        backgroundColor: AppColors.transparent,
        borderWidth: 2,
        borderColor: AppColors.blue,
    },
    chipText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    chipTextSelected: {
        color: AppColors.whiteText,
    },
    chipTextUnselected: {
        color: AppColors.blue,
    },
    weatherCard: {
        backgroundColor: AppColors.cardBg,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        marginBottom: 12,
    },
    weatherTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherTemp: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColors.blue,
        marginRight: 12,
    },
    weatherDesc: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.primaryGreen,
        textTransform: 'capitalize',
    },
    divider: {
        height: 2,
        backgroundColor: AppColors.blue,
        marginVertical: 8,
    },
    weatherBottom: {
        paddingLeft: 8,
    },
    weatherDetailText: {
        fontSize: 14,
        color: AppColors.darkText,
        marginBottom: 2,
    },
    weatherMainText: {
        fontSize: 14,
        color: AppColors.blue,
        fontWeight: 'bold',
    },
    alertsCard: {
        backgroundColor: AppColors.warningOrange,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.whiteText,
    },
    alertsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertsList: {
        minHeight: 48,
    },
    alertsLoadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    alertsLoadingText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginLeft: 8,
    },
    alertItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)',
    },
    alertItemLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    alertItemInfo: {
        marginLeft: 8,
        flex: 1,
    },
    alertActivityName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    alertWhen: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 2,
    },
    alertWeatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },
    alertWeatherNote: {
        color: '#FFD54F',
        fontSize: 11,
        marginLeft: 4,
        flex: 1,
    },
    alertStatusBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginLeft: 8,
    },
    alertStatusText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    noDataText: {
        color: AppColors.whiteText,
        textAlign: 'center',
        marginTop: 8,
    },
    neighborsCard: {
        backgroundColor: AppColors.blue,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    neighborsContent: {},
    noNeighbours: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noNeighboursText: {
        color: AppColors.whiteText,
        fontSize: 16,
    },
    neighborsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    neighborItem: {
        backgroundColor: AppColors.cardBg,
        borderRadius: 12,
        padding: 10,
        width: '48%',
        marginBottom: 8,
    },
    neighborLandName: {
        color: AppColors.primaryGreen,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    neighborRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    neighborAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    neighborFarmerName: {
        fontWeight: 'bold',
        fontSize: 13,
        color: AppColors.primaryGreen,
        flex: 1,
    },
    neighborCropName: {
        color: AppColors.greyText,
        fontSize: 12,
        flex: 1,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    fullImage: {
        width: '100%',
        height: '80%',
    },
    neighborsContent: {},
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        height: 60,
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginVertical: 5,
    },
    txtinpp: {
        flex: 1,
        color: "#000",
        fontSize: 10,
    },
});

export default Home;
