import React, { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { signup, citiess } from "../api";

const Signup = ({ navigation }) => {
    const [checked, setChecked] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [province, setProvince] = useState(null);
    const [city, setCity] = useState(null);
    const [landmark, setLandmark] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submittedloading, Setsubmittedloading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [citiesOption, SetCitiesOption] = useState([]);

    const provinces = [
        { label: "Punjab", value: 1 },
        { label: "Sindh", value: 2 },
        { label: "Khyber Pakhtunkhwa", value: 3 },
        { label: "Balochistan", value: 4 },
        { label: "Gilgit-Baltistan", value: 5 },
        { label: "Azad Jammu and Kashmir", value: 6 },
        { label: "Islamabad", value: 7 }
    ]
    useEffect(() => {
        const fetchcities = async () => {
            if (province) {
                // setLoading(true);
                setCity(null);

                try {
                    const response = await citiess(province);
                    if (Array.isArray(response)) {
                        const Newcities = response.map(Cname => ({
                            label: Cname,
                            value: Cname
                        }));
                        SetCitiesOption(Newcities);
                    }
                    else {
                        console.error("Unexpected response format:", response);
                        SetCitiesOption([]);
                        Alert.alert("Error", "Failed to load cities");
                    }
                } catch (error) {
                    console.error("Error fetching cities:", error);
                    SetCitiesOption([]);
                } finally {
                    // setLoading(false);
                }

            } else {
                SetCitiesOption([]);
                setCity(null);

            }
        };
        fetchcities();
    }, [province])

    const handleSignup = async () => {
        if (!name || !phone || !email || !city || !password || !yearsOfExperience) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (!checked) {
            Alert.alert("Error", "Please agree to the Terms and Conditions");
            return;
        }

        setLoading(true);
        try {
            const data = {
                name: name,
                number: phone,
                email: email,
                landmark: landmark,
                password: password,
                city: city,
                yearsofexp: yearsOfExperience
            };
            console.log("Signup data:", data);
            const response = await signup(data);
            Alert.alert("Success", "Account created successfully!");
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert("Signup Failed", error.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={ss.main}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">

            <View style={ss.title}>
                <Text style={ss.titleGreen}>Create Account</Text>
                <Text style={ss.titleBlue}>🌱 Join the AI-Powered Farming Revolution! 🚜{"\n"}
                </Text>
            </View>
            <View>
                <View style={ss.inputBox}>
                    <Icon name="person-outline" size={20} color="#939793" />
                    <TextInput
                        style={ss.txtinpp}
                        placeholder="Enter your Name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={ss.inputBox}>
                    <Icon name="phone" size={20} color="#939793" />
                    <TextInput
                        style={ss.txtinpp}
                        placeholder="Enter your Phone Number"
                        keyboardType="number-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>
                <View style={ss.inputBox}>
                    <Icon name="email" size={20} color="#939793" />
                    <TextInput
                        style={ss.txtinpp}
                        placeholder="Enter your Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Dropdown style={ss.dropdown}
                            placeholder="Province"
                            data={provinces}
                            labelField="label"
                            valueField="value"
                            value={province}
                            onChange={item => { setProvince(item.value) }}
                        />
                    </View>
                    <View>
                        <Dropdown style={ss.dropdown}
                            placeholder="City"
                            data={citiesOption}
                            labelField="label"
                            valueField="value"
                            value={city}
                            onChange={item => { setCity(item.value) }}
                        />
                    </View>
                </View>
                <View>
                    <View style={ss.inputBox}>
                        <Icon name="map" size={20} color="#939793" />
                        <TextInput
                            style={ss.txtinpp}
                            placeholder="Landmark / Nearest Village (Opt)"
                            value={landmark}
                            onChangeText={setLandmark}
                        />
                    </View>
                    <View style={ss.inputBox}>
                        <TextInput
                            style={ss.txtinpp}
                            placeholder="Year's of Experience"
                            keyboardType="number-pad"
                            value={yearsOfExperience}
                            onChangeText={setYearsOfExperience}
                        />
                    </View>
                    <View style={ss.inputBox}>
                        <TextInput
                            style={ss.txtinpp}
                            placeholder="Enter Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={ss.inputBox}>
                        <TextInput
                            style={ss.txtinpp}
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: "row", }}>
                    <Checkbox status={checked ? 'checked' : 'unchecked'}
                        uncheckedColor="#1ed75fe8"
                        color="#1ed75fe8"
                        onPress={() => { setChecked(!checked) }}
                    >
                    </Checkbox>
                    <Text style={{ marginLeft: 10 }}>I agree to the Terms and Conditions</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <TouchableOpacity
                        style={{ backgroundColor: "#1ED760", width: wp('88%'), height: hp('6%'), alignItems: "center", padding: wp('2.5%'), borderRadius: 10 }}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        <View>
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={{ color: "white", fontSize: hp('2%') }}>SIGN UP</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const ss = StyleSheet.create({
    main: { alignItems: "center", paddingVertical: hp('2%') },
    title: {
        alignItems: "center", marginVertical: hp('2%')
    },
    titleGreen: {
        fontSize: hp('3.5%'),
        fontWeight: "bold",
        color: "#1ED760",
    },
    titleBlue: {
        marginTop: hp('0.5%'),
        color: "#1E90FF",
        textAlign: "center",
        fontSize: hp('2%')
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        width: wp('88%'),
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: wp('3%'),
        margin: wp('1.5%'),
    },
    txtinpp: {
        flex: 1,
        paddingLeft: wp('2%'),
        color: "#000",
        fontSize: hp('1.8%')
    },
    txtinp: {
        padding: wp('2.5%'),
        width: wp('88%'),
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        margin: wp('1.5%')
    },
    dropdown: {
        width: wp('42%'),
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        margin: wp('1.5%'),
        paddingHorizontal: wp('2%'),
    },

})
export default Signup;