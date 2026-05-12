import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { Icon } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import Modal from 'react-native-modal';
import { getLandsWithCurrentSession, getActivitiesList, BASE_URL } from '../api';
import { Calendar } from 'react-native-calendars';

const AddActivity = ({ navigation, route }) => {
    const editActivity = route.params?.activity;
    const farmerId = route.params?.id;

    const [land, setLand] = useState(editActivity?.land || null);
    const [sessionId, setSessionId] = useState(0);
    const [activityType, setActivityType] = useState(editActivity?.type || null);
    const [quantity, setQuantity] = useState(editActivity?.detail?.split(' | ')[0] || '');
    const [type, setType] = useState('');
    const [date, setDate] = useState(editActivity?.date || '');
    const [profit, setProfit] = useState('');
    const [amountPerAcre, setAmountPerAcre] = useState('');

    const [lands, setLands] = useState([]);
    const [activityTypes, setActivityTypes] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (farmerId) {
                    const landsData = await getLandsWithCurrentSession(farmerId);
                    if (Array.isArray(landsData)) {
                        const mappedLands = landsData.map(l => ({
                            name: l["Land Name"],
                            lid: l["Land Name"],
                            cultivation_session_id: l.cultivation_session_id
                        }));
                        setLands(mappedLands);
                    }
                }
            } catch (error) {
                // If 404 No Current Session exists, we just leave lands empty.
                console.warn("No lands found with current session:", error);
            }

            try {
                const activitiesData = await getActivitiesList();
                if (Array.isArray(activitiesData)) {
                    const mappedActivities = activitiesData.map(a => ({
                        label: a.name,
                        value: a.id,
                        name: a.name
                    }));
                    setActivityTypes(mappedActivities);
                }
            } catch (error) {
                Alert.alert("Error fetching activities", String(error));
            }
        };

        fetchData();
    }, [farmerId]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };



    const handleSave = async () => {
        if (!sessionId || !activityType || !quantity || !date || !type) {
            Alert.alert("Validation", "Please fill all required fields");
            return;
        }

        try {
            const formData = new FormData();

            const sessionInfo = {
                amount_per_acre: amountPerAcre || "0",
                is_profit: profit.toLowerCase() === "yes" ? 1 : 0
            };

            const activityInfo = {
                cultivation_session_id: sessionId,
                Activity_id: activityType,
                quantity_per_acre: quantity,
                activity_date: date,
                Activity_type: type
            };

            formData.append("session_info", JSON.stringify(sessionInfo));
            formData.append("Activity", JSON.stringify(activityInfo));

            const response = await fetch(`${BASE_URL}/AddFarmerSessionActivity`, {
                method: 'POST',
                body: formData,
                headers: {
                    // Fetch will automatically set the Content-Type to multipart/form-data with the correct boundary
                }
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Activity added successfully");
                navigation.goBack();
            } else {
                Alert.alert("Error", result.message || "Failed to add activity");
            }
        } catch (error) {
            Alert.alert("Error", String(error));
        }
    };

    const selectedActivityObj = activityTypes.find(a => a.value === activityType);
    const isHarvesting = selectedActivityObj && selectedActivityObj.name === "Harvesting";

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="chevron-left" size={hp('3.5%')} color="#1E90FF" />
                </TouchableOpacity>
                <Text style={styles.title}>{editActivity ? "Edit Activity" : "Add Activity"}</Text>
                <View style={{ width: wp('8%') }} />
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={lands}
                    labelField="name"
                    valueField="lid"
                    placeholder="Select Land"
                    value={land}
                    onChange={item => {
                        setLand(item.lid);
                        setSessionId(item.cultivation_session_id);
                    }}
                />

                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={activityTypes}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Activity"
                    value={activityType}
                    onChange={item => setActivityType(item.value)}
                />

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.txtinpp}
                        placeholder="Type"
                        value={type}
                        onChangeText={setType}
                    />
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.txtinpp}
                        placeholder="Quantity per Acre"
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="number-pad"
                    />
                </View>

                {isHarvesting && (
                    <View style={styles.harvestingContainer}>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.txtinpp}
                                placeholder="Profit (yes/no)"
                                value={profit}
                                onChangeText={setProfit}
                            />
                        </View>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.txtinpp}
                                placeholder="Amount Per Acre"
                                value={amountPerAcre}
                                onChangeText={setAmountPerAcre}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                )}

                <TouchableOpacity style={styles.inputBox} onPress={showDatePicker}>
                    <TextInput
                        style={styles.txtinpp}
                        placeholder="Activity Date"
                        value={date}
                        editable={false}
                        pointerEvents="none"
                    />
                    <Icon source="calendar-month-outline" size={hp('3%')} color="#ccc" />
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
                            }}
                        />
                        <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} onPress={hideDatePicker}>
                            <Text style={{ color: '#1E90FF', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleSave}
                >
                    <Text style={styles.addButtonText}>{editActivity ? "Update Activity" : "Add Activity"}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        height: hp('8%'),
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp('4%'),
    },
    title: {
        fontSize: hp('3%'),
        fontWeight: "bold",
        color: "#1ED760",
    },
    formContainer: {
        padding: wp('5%'),
        alignItems: 'center',
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: wp('4%'),
        marginVertical: hp('1.2%'),
    },
    txtinpp: {
        flex: 1,
        color: "#000",
        fontSize: hp('2%'),
    },
    dropdown: {
        width: '100%',
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: wp('4%'),
        marginVertical: hp('1.2%'),
    },
    placeholderStyle: {
        fontSize: hp('2%'),
        color: '#ccc',
    },
    selectedTextStyle: {
        fontSize: hp('2%'),
        color: '#000',
    },
    harvestingContainer: {
        width: '100%',
    },
    addButton: {
        backgroundColor: "#1ED760",
        width: '100%',
        height: hp('6%'),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: hp('2.5%'),
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: hp('2.2%'),
    },
});

export default AddActivity;
