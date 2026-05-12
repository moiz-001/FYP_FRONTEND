import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Icon } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { citiess, addLand, updateLand } from '../api';

import { Alert } from 'react-native';



const AddLand = ({ navigation, route }) => {
    const editLand = route.params?.land;
    const farmerId = route.params?.id;

    const [landName, setLandName] = useState(editLand?.land_name || "");
    const [province, setProvince] = useState(null);
    const [city, setCity] = useState(editLand?.city_name || null);
    const [landmark, setLandmark] = useState(editLand?.landmark || "");
    const [acres, setAcres] = useState(editLand?.land_in_acres?.toString() || "");
    const [yearsOfCultivation, setYearsOfCultivation] = useState(editLand?.years_of_cultivation || "");

    const [waterSource, setWaterSource] = useState(editLand?.source_of_water || null);
    const [soilType, setSoilType] = useState(editLand?.soil_type || null);
    const [citiesOption, setCitiesOption] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            if (province) {
                setLoadingCities(true);
                try {
                    const response = await citiess(province);
                    if (Array.isArray(response)) {
                        const formattedCities = response.map(cityName => ({
                            label: cityName,
                            value: cityName
                        }));
                        setCitiesOption(formattedCities);
                    } else {
                        console.error("Unexpected response format:", response);
                        setCitiesOption([]);
                    }
                } catch (error) {
                    console.error("Error fetching cities:", error);
                    setCitiesOption([]);
                } finally {
                    setLoadingCities(false);
                }
            } else {
                setCitiesOption([]);
            }
        };
        fetchCities();
    }, [province]);


    const waterSources = [
        { label: "Canal", value: "Canal" },
        { label: "Tube Well", value: "Tube Well" },
        { label: "Both", value: "Both" },
        { label: "Rainwater", value: "Rainwater" },
    ]
    const provinces = [
        { label: "Punjab", value: 1 },
        { label: "Sindh", value: 2 },
        { label: "Khyber Pakhtunkhwa", value: 3 },
        { label: "Balochistan", value: 4 },
        { label: "Gilgit-Baltistan", value: 5 },
        { label: "Azad Jammu and Kashmir", value: 6 },
        { label: "Islamabad", value: 7 }]



    const soilTypes = [
        { label: "Clay", value: "Clay" },
        { label: "Silt", value: "Silt" },
        { label: "Sand", value: "Sand" },
        { label: "Loam", value: "Loam" },
    ]

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon source="chevron-left" size={30} color="#1E90FF" />
                </TouchableOpacity>
                <Text style={styles.title}>{editLand ? "Edit Land" : "Add Land"}</Text>
                <View style={{ width: wp('8%') }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: "center", marginVertical: hp('2.5%') }}>
                    <View style={styles.formContainer}>
                        <View style={styles.inputBox}>
                            <Icon source="leaf" size={hp('2.5%')} color="#939793" />
                            <TextInput
                                style={styles.txtinpp}
                                placeholder="Land Name"
                                value={landName}
                                onChangeText={setLandName}
                            />
                        </View>

                        <View style={styles.row}>
                            <Dropdown
                                style={[styles.dropdown, { marginRight: 5 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={provinces}
                                labelField="label"
                                valueField="value"
                                placeholder="Province"
                                value={province}
                                onChange={item => setProvince(item.value)}
                                renderLeftIcon={() => (
                                    <Icon source="map-marker-outline" size={hp('2.5%')} color="#939793" />
                                )}
                            />
                            <Dropdown
                                style={[styles.dropdown, { marginLeft: wp('1.5%') }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={citiesOption}
                                labelField="label"
                                valueField="value"
                                placeholder={loadingCities ? "Loading..." : "City"}
                                value={city}
                                onChange={item => setCity(item.value)}
                                disable={!province || loadingCities}
                                renderLeftIcon={() => (
                                    <Icon source="office-building" size={hp('2.5%')} color="#939793" />
                                )}
                            />

                        </View>

                        <View style={styles.inputBox}>
                            <Icon source="map-legend" size={hp('2.5%')} color="#939793" />
                            <TextInput
                                style={styles.txtinpp}
                                placeholder="Landmark / Nearest Village (Optional)"
                                value={landmark}
                                onChangeText={setLandmark}
                            />
                        </View>

                        <View style={styles.inputBox}>
                            <Icon source="sprout" size={hp('2.5%')} color="#939793" />
                            <TextInput
                                style={styles.txtinpp}
                                placeholder="Enter land In ACRES"
                                keyboardType="number-pad"
                                value={acres}
                                onChangeText={setAcres}
                            />
                        </View>

                        <View style={styles.inputBox}>
                            <Icon source="tractor" size={hp('2.5%')} color="#939793" />
                            <TextInput
                                style={styles.txtinpp}
                                placeholder="Years of Cultivation"
                                value={yearsOfCultivation}
                                onChangeText={setYearsOfCultivation}
                            />
                        </View>

                        <Dropdown
                            style={styles.inputBox}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={waterSources}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Source of Water"
                            value={waterSource}
                            onChange={item => setWaterSource(item.value)}
                            renderLeftIcon={() => (
                                <Icon source="water" size={hp('2.5%')} color="#939793" />
                            )}
                        />

                        <Dropdown
                            style={styles.inputBox}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={soilTypes}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Soil Type (optional)"
                            value={soilType}
                            onChange={item => setSoilType(item.value)}
                            renderLeftIcon={() => (
                                <Icon source="layers-outline" size={hp('2.5%')} color="#939793" />
                            )}
                        />

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={async () => {
                                if (!landName || !city || !acres || !yearsOfCultivation || !waterSource) {
                                    Alert.alert("Error", "Please fill all required fields");
                                    return;
                                }

                                try {
                                    if (editLand) {
                                        const payload = {
                                            id: editLand?.land_id,
                                            city_name: city,
                                            land_name: landName,
                                            years_of_cultivation: yearsOfCultivation,
                                            soil_type: soilType,
                                            source_of_water: waterSource,
                                            land_in_acres: acres,
                                            landmark: landmark
                                        };
                                        const response = await updateLand(payload);
                                        Alert.alert("Success", "Land updated successfully!");
                                        navigation.goBack();
                                    } else {

                                        if (!farmerId) {
                                            Alert.alert("Error", "Farmer ID missing. Please login again.");
                                            return;
                                        }

                                        const payload = {
                                            farmer_id: farmerId,
                                            city_id: city,
                                            land_name: landName,
                                            years_of_cultivation: yearsOfCultivation,
                                            soil_type: soilType,
                                            source_of_water: waterSource,
                                            land_in_acres: acres,
                                            landmark: landmark
                                        };
                                        const response = await addLand(payload);
                                        Alert.alert("Success", "Land added successfully!");
                                        navigation.goBack();
                                    }
                                } catch (error) {
                                    console.error("Error submitting land:", error);
                                    Alert.alert("Error", typeof error === 'string' ? error : "Failed to submit land");
                                }

                            }}
                        >
                            <Text style={styles.addButtonText}>{editLand ? "Update Land" : "Add Land"}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: "#fFfFfF" },
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
    title: {
        fontSize: hp('3.2%'),
        fontWeight: "bold",
        color: "#1ED760",
        textAlign: "center",
    },
    formContainer: {
        width: wp('90%'),
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
        marginVertical: hp('1%'),
    },
    txtinpp: {
        flex: 1,
        paddingLeft: wp('2.5%'),
        color: "#000",
        fontSize: hp('2%')
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
        marginVertical: hp('1%'),
    },
    dropdown: {
        flex: 1,
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: wp('4%'),
    },
    placeholderStyle: {
        fontSize: hp('2%'),
        color: '#939793',
        paddingLeft: wp('2.5%'),
    },
    selectedTextStyle: {
        fontSize: hp('2%'),
        color: '#000',
        paddingLeft: wp('2.5%'),
    },
    addButton: {
        backgroundColor: "#1ED760",
        width: '100%',
        height: hp('6%'),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginVertical: hp('2.5%'),
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: hp('2.2%')
    },
});

export default AddLand;
