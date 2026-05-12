// import React, { useState } from 'react';
// import {
//     View, Text, StyleSheet, TouchableOpacity, Image,
//     TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert
// } from 'react-native';
// import { Icon } from "react-native-paper";
// import { Dropdown } from "react-native-element-dropdown";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const Setting = ({ navigation }) => {
//     const [formData, setFormData] = useState({
//         name: 'Abdul Moiz',
//         phone: '03359099994',
//         email: 'abdulmoiz.az001@gmail.com',
//         province: null,
//         city: null,
//         landmark: '',
//         numberOfPeople: '2',
//         password: '',
//         confirmPassword: ''
//     });

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const provinces = [
//         { label: "Punjab", value: "Punjab" },
//         { label: "Sindh", value: "Sindh" },
//         { label: "KPK", value: "KPK" },
//         { label: "Balochistan", value: "Balochistan" },
//     ];

//     const cities = [
//         { label: "Lahore", value: "Lahore" },
//         { label: "Kamaliya", value: "Kamaliya" },
//         { label: "Faislabad", value: "Faislabad" },
//         { label: "Rawalpindi", value: "Rawalpindi" },
//     ];

//     const updateFormData = (key, value) => {
//         setFormData({ ...formData, [key]: value });
//     };

//     const validateForm = () => {
//         if (!formData.name.trim()) {
//             Alert.alert('Validation Error', 'Please enter your name');
//             return false;
//         }
//         if (!formData.phone.trim()) {
//             Alert.alert('Validation Error', 'Please enter your phone number');
//             return false;
//         }
//         if (!formData.email.trim()) {
//             Alert.alert('Validation Error', 'Please enter your email');
//             return false;
//         }
//         if (!formData.province) {
//             Alert.alert('Validation Error', 'Please select a province');
//             return false;
//         }
//         if (!formData.city) {
//             Alert.alert('Validation Error', 'Please select a city');
//             return false;
//         }
//         if (formData.password && formData.password !== formData.confirmPassword) {
//             Alert.alert('Validation Error', 'Passwords do not match');
//             return false;
//         }
//         return true;
//     };

//     const handleSave = () => {
//         if (validateForm()) {
//             Alert.alert('Success', 'Profile updated successfully');
//             navigation.navigate('Home');
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.keyboardView}
//         >
//             <ScrollView
//                 style={styles.main}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <View style={styles.container}>

//                     <View style={styles.imageContainer}>
//                         <Image
//                             source={require("../images/bold.png")}
//                             style={styles.image}
//                         />
//                         <TouchableOpacity
//                             style={styles.cameraIconContainer}
//                             accessibilityLabel="Change profile picture"
//                             accessibilityHint="Tap to change your profile image"
//                         >
//                             <Icon source="camera" size={hp('2.5%')} color="#FFFFFF" />
//                         </TouchableOpacity>
//                     </View>


//                     <View>

//                         <View style={styles.inputBox}>
//                             <Icon source="account-outline" size={hp('2.5%')} color="#939793" />
//                             <TextInput
//                                 style={styles.txtinpp}
//                                 placeholder="Full Name"
//                                 value={formData.name}
//                                 onChangeText={(text) => updateFormData('name', text)}
//                                 accessibilityLabel="Name input field"
//                                 accessibilityHint="Enter your full name"
//                             />
//                         </View>


//                         <View style={styles.inputBox}>
//                             <Icon source="phone" size={hp('2.5%')} color="#939793" />
//                             <TextInput
//                                 style={styles.txtinpp}
//                                 placeholder="Phone Number"
//                                 value={formData.phone}
//                                 onChangeText={(text) => updateFormData('phone', text)}
//                                 keyboardType="phone-pad"
//                                 accessibilityLabel="Phone number input"
//                             />
//                         </View>


//                         <View style={styles.inputBox}>
//                             <Icon source="email-outline" size={hp('2.5%')} color="#939793" />
//                             <TextInput
//                                 style={styles.txtinpp}
//                                 placeholder="Email Address"
//                                 value={formData.email}
//                                 onChangeText={(text) => updateFormData('email', text)}
//                                 keyboardType="email-address"
//                                 autoCapitalize="none"
//                                 accessibilityLabel="Email input"
//                             />
//                         </View>


//                         <View style={styles.rowContainer}>
//                             <View style={styles.dropdownWrapper}>
//                                 <Dropdown
//                                     style={styles.dropdown}
//                                     placeholderStyle={styles.placeholderStyle}
//                                     selectedTextStyle={styles.selectedTextStyle}
//                                     data={provinces}
//                                     labelField="label"
//                                     valueField="value"
//                                     placeholder="Province"
//                                     value={formData.province}
//                                     onChange={item => updateFormData('province', item.value)}
//                                     accessibilityLabel="Province dropdown"
//                                 />
//                             </View>

//                             <View style={styles.dropdownWrapper}>
//                                 <Dropdown
//                                     style={styles.dropdown}
//                                     placeholderStyle={styles.placeholderStyle}
//                                     selectedTextStyle={styles.selectedTextStyle}
//                                     data={cities}
//                                     labelField="label"
//                                     valueField="value"
//                                     placeholder="City"
//                                     value={formData.city}
//                                     onChange={item => updateFormData('city', item.value)}
//                                     accessibilityLabel="City dropdown"
//                                 />
//                             </View>
//                         </View>


//                         <View style={styles.inputBox}>
//                             <Icon source="map-marker" size={hp('2.5%')} color="#939793" />
//                             <TextInput
//                                 style={styles.txtinpp}
//                                 placeholder="Landmark / Nearest Village (Optional)"
//                                 value={formData.landmark}
//                                 onChangeText={(text) => updateFormData('landmark', text)}
//                                 accessibilityLabel="Landmark input"
//                             />
//                         </View>


//                         <View style={styles.inputBox}>
//                             <Icon source="account-group" size={hp('2.5%')} color="#939793" />
//                             <TextInput
//                                 style={styles.txtinpp}
//                                 placeholder="Number of People"
//                                 value={formData.numberOfPeople}
//                                 onChangeText={(text) => updateFormData('numberOfPeople', text)}
//                                 keyboardType="number-pad"
//                                 accessibilityLabel="Number of people input"
//                             />
//                         </View>


//                         <View style={styles.inputBox}>
//                             <Icon source="lock-outline" size={hp('2.5%')} color="#939793" />
//                             <TextInput
//                                 style={styles.txtinpp}
//                                 placeholder="Enter Password"
//                                 value={formData.password}
//                                 onChangeText={(text) => updateFormData('password', text)}
//                                 secureTextEntry={!showPassword}
//                                 accessibilityLabel="Password input"
//                             />
//                             <TouchableOpacity
//                                 onPress={() => setShowPassword(!showPassword)}
//                                 accessibilityLabel={showPassword ? "Hide password" : "Show password"}
//                             >
//                                 <Icon
//                                     source={showPassword ? "eye-off" : "eye"}
//                                     size={hp('2.5%')}
//                                     color="#939793"
//                                 />
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.inputBox}>
//                             <Icon source="lock-outline" size={hp('2.5%')} color="#939793" />
//                             <TextInput
//                                 style={styles.txtinpp}
//                                 placeholder="Confirm Password"
//                                 value={formData.confirmPassword}
//                                 onChangeText={(text) => updateFormData('confirmPassword', text)}
//                                 secureTextEntry={!showConfirmPassword}
//                                 accessibilityLabel="Confirm password input"
//                             />
//                             <TouchableOpacity
//                                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
//                             >
//                                 <Icon
//                                     source={showConfirmPassword ? "eye-off" : "eye"}
//                                     size={hp('2.5%')}
//                                     color="#939793"
//                                 />
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.buttonContainer}>
//                             <TouchableOpacity
//                                 style={styles.saveButton}
//                                 onPress={handleSave}
//                                 accessibilityLabel="Save button"
//                                 accessibilityHint="Save your profile changes"
//                             >
//                                 <Text style={styles.saveButtonText}>Save</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

// const styles = StyleSheet.create({
//     keyboardView: {
//         flex: 1,
//     },
//     main: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     container: {
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         paddingHorizontal: wp('5%'),
//         paddingBottom: hp('3%'),
//     },
//     imageContainer: {
//         alignItems: "center",
//         marginVertical: hp('2.5%'),
//         position: 'relative',
//     },
//     image: {
//         width: wp('30%'),
//         height: wp('30%'),
//         borderColor: "#1ED760",
//         borderRadius: wp('15%'),
//         borderWidth: 3,
//     },
//     cameraIconContainer: {
//         position: 'absolute',
//         bottom: 0,
//         right: 0,
//         backgroundColor: '#1ED760',
//         width: wp('9%'),
//         height: wp('9%'),
//         borderRadius: wp('4.5%'),
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 2,
//         borderColor: '#FFFFFF',
//     },
//     inputBox: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#1ed75fe8',
//         borderRadius: 10,
//         paddingHorizontal: wp('3%'),
//         marginVertical: hp('0.5%'),
//         width: wp('88%'),
//         height: hp('6.5%'),
//         backgroundColor: '#fff',
//     },
//     txtinpp: {
//         flex: 1,
//         marginLeft: wp('2.5%'),
//         color: '#000',
//         fontSize: hp('2%'),
//     },
//     rowContainer: {
//         flexDirection: "row",
//         justifyContent: 'space-between',
//         width: wp('88%'),
//         marginVertical: hp('1%'),
//     },
//     dropdownWrapper: {
//         width: wp('43%'),
//     },
//     dropdown: {
//         height: hp('6.5%'),
//         borderColor: "#1ed75fe8",
//         borderWidth: 1,
//         borderRadius: 10,
//         paddingHorizontal: wp('3%'),
//     },
//     placeholderStyle: {
//         fontSize: hp('2%'),
//         color: '#999',
//     },
//     selectedTextStyle: {
//         fontSize: hp('2%'),
//         color: '#000',
//     },
//     buttonContainer: {
//         marginVertical: hp('2.5%'),
//         alignItems: "center",
//     },
//     saveButton: {
//         backgroundColor: "#1ED760",
//         width: wp('88%'),
//         height: hp('6.5%'),
//         alignItems: "center",
//         justifyContent: "center",
//         borderRadius: 10,
//         elevation: 2,
//     },
//     saveButtonText: {
//         color: "white",
//         fontWeight: "bold",
//         fontSize: hp('2.2%'),
//     },
// });

// export default Setting;
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Icon } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getFarmer, citiess, updateFarmer, BASE_URL } from "../api";

const AppColors = {
    primaryGreen: '#1ED760',
    blue: '#1E90FF',
    whiteBg: '#FFFFFF',
    greyBg: '#F5F5F5',
    dividerGrey: '#E0E0E0',
    darkText: '#333333',
    lightText: '#666666',
};

const Setting = ({ navigation, route }) => {
    const farmerId = route.params?.id;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [provincesList] = useState([
        { label: "Punjab", value: 1 },
        { label: "Sindh", value: 2 },
        { label: "Khyber Pakhtunkhwa", value: 3 },
        { label: "Balochistan", value: 4 },
        { label: "Gilgit-Baltistan", value: 5 },
        { label: "Azad Jammu and Kashmir", value: 6 },
        { label: "Islamabad", value: 7 }
    ]);
    const [citiesList, setCitiesList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [imageChanged, setImageChanged] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        province: null,
        city: null,
        landmark: '',
        yearsOfExp: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!farmerId) return;
            try {
                setFetching(true);
                const farmer = await getFarmer(farmerId);
                if (farmer) {
                    const matchedProvince = provincesList.find(p => p.label === farmer.Province);
                    const provinceId = matchedProvince ? matchedProvince.value : null;

                    setFormData({
                        name: farmer.Name || '',
                        phone: farmer.Phone || '',
                        email: farmer.Email || '',
                        province: provinceId,
                        city: farmer.City || '',
                        landmark: farmer.Landmark || '',
                        yearsOfExp: farmer.years_of_experience?.toString() || '',
                        password: '',
                        confirmPassword: ''
                    });

                    if (farmer.image) {
                        setSelectedImage(farmer.image.startsWith('http') ? farmer.image : `${BASE_URL}/${farmer.image}`);
                    }

                    if (provinceId) {
                        const cts = await citiess(provinceId);
                        if (Array.isArray(cts)) {
                            setCitiesList(cts.map(c => ({ label: c, value: c })));
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setFetching(false);
            }
        };
        loadInitialData();
    }, [farmerId]);

    const handleProvinceChange = async (item) => {
        setFormData({ ...formData, province: item.value, city: null });
        try {
            const response = await citiess(item.value);
            if (Array.isArray(response)) {
                setCitiesList(response.map(c => ({ label: c, value: c })));
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };


    const handleImagePick = () => {
        Alert.alert("Select Image", "Choose an option", [
            {
                text: "Camera",
                onPress: () => {
                    launchCamera(
                        { mediaType: 'photo', quality: 0.7 },
                        handleResponse
                    );
                }
            },
            {
                text: "Gallery",
                onPress: () => {
                    launchImageLibrary(
                        { mediaType: 'photo', quality: 0.7 },
                        handleResponse
                    );
                }
            },
            { text: "Cancel", style: "cancel" }
        ]);
    };

    const handleResponse = (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
            Alert.alert("Error", response.errorMessage || "Something went wrong");
            return;
        }

        const asset = response.assets?.[0];

        if (asset) {
            setSelectedImage(asset.uri);
            setSelectedAsset(asset);
            setImageChanged(true);
        }
    };

    // const handleImagePick = () => {
    //     Alert.alert("Select Image", "Choose an option", [
    //         {
    //             text: "Camera",
    //             onPress: () => {
    //                 launchCamera(
    //                     { mediaType: 'photo', quality: 0.7 },
    //                     onImagePicked
    //                 );
    //             }
    //         },
    //         {
    //             text: "Gallery",
    //             onPress: () => {
    //                 launchImageLibrary(
    //                     { mediaType: 'photo', quality: 0.7 },
    //                     onImagePicked
    //                 );
    //             }
    //         },
    //         { text: "Cancel", style: "cancel" }
    //     ]);
    // };
    // const onImagePicked = (response) => {
    //     if (response.didCancel) {
    //         console.log('User cancelled image picker');
    //     } else if (response.errorCode) {
    //         console.log('ImagePicker Error: ', response.errorMessage);
    //         Alert.alert('Error', response.errorMessage);
    //     } else if (response.assets && response.assets.length > 0) {
    //         const asset = response.assets[0];
    //         setSelectedImage(asset.uri);
    //         setSelectedAsset(asset);
    //         setImageChanged(true);
    //     }
    // };

    const handleSave = async () => {
        if (!formData.name || !formData.phone || !formData.email || !formData.province || !formData.city) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const farmerJson = {
                id: farmerId,
                name: formData.name,
                number: formData.phone,
                email: formData.email,
                landmark: formData.landmark,
                city: formData.city,
                password: formData.password,
                years_of_experience: formData.yearsOfExp
            };

            const data = new FormData();
            data.append('farmer', JSON.stringify(farmerJson));
            data.append('update_image', imageChanged ? 'true' : 'false');

            if (imageChanged && selectedAsset) {
                data.append('image', {
                    uri: selectedAsset.uri,
                    name: selectedAsset.fileName || `profile_${Date.now()}.jpg`,
                    type: selectedAsset.type || 'image/jpeg'
                });
            }

            await updateFarmer(data);
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error("Update failed:", error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <View style={ss.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.primaryGreen} />
            </View>
        );
    }

    return (
        <SafeAreaView style={ss.container}>
            {/* <View style={ss.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}>
                    <Icon source="chevron-left" size={32} color={AppColors.blue} />
                </TouchableOpacity>
                <Text style={ss.headerTitle}>Profile Settings</Text>
                <View style={{ width: 32 }} />
            </View> */}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ss.scrollContent}>
                    <View style={ss.profileSection}>
                        <View style={ss.imageWrapper}>
                            <Image
                                source={selectedImage ? { uri: selectedImage } : require('../images/default-avatar.png')}
                                style={ss.profileImage}
                            />
                            <TouchableOpacity style={ss.cameraBtn} onPress={handleImagePick}>
                                <Icon source="camera" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={ss.profileName}>{formData.name || 'Farmer Name'}</Text>
                        <Text style={ss.profileEmail}>{formData.email || 'email@example.com'}</Text>
                    </View>

                    <View style={ss.formSection}>
                        <InputBox
                            icon="account-outline"
                            placeholder="Full Name"
                            value={formData.name}
                            onChangeText={t => setFormData({ ...formData, name: t })}
                        />
                        <InputBox
                            icon="phone-outline"
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={t => setFormData({ ...formData, phone: t })}
                        />
                        <InputBox
                            icon="email-outline"
                            placeholder="Email Address"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={t => setFormData({ ...formData, email: t })}
                        />

                        <View style={ss.row}>
                            <Dropdown
                                style={[ss.dropdown, { width: '48%' }]}
                                placeholderStyle={ss.placeholder}
                                selectedTextStyle={ss.selectedText}
                                data={provincesList}
                                labelField="label"
                                valueField="value"
                                placeholder="Province"
                                value={formData.province}
                                onChange={handleProvinceChange}
                            />
                            <Dropdown
                                style={[ss.dropdown, { width: '48%' }]}
                                placeholderStyle={ss.placeholder}
                                selectedTextStyle={ss.selectedText}
                                data={citiesList}
                                labelField="label"
                                valueField="value"
                                placeholder="City"
                                value={formData.city}
                                onChange={item => setFormData({ ...formData, city: item.value })}
                            />
                        </View>

                        <InputBox
                            icon="map-marker-outline"
                            placeholder="Landmark (Optional)"
                            value={formData.landmark}
                            onChangeText={t => setFormData({ ...formData, landmark: t })}
                        />

                        <InputBox
                            icon="calendar-outline"
                            placeholder="Years of Experience"
                            keyboardType="numeric"
                            value={formData.yearsOfExp}
                            onChangeText={t => setFormData({ ...formData, yearsOfExp: t })}
                        />

                        <View style={ss.divider} />
                        <Text style={ss.sectionLabel}>Security</Text>

                        <InputBox
                            icon="lock-outline"
                            placeholder="New Password"
                            secureTextEntry={!showPassword}
                            value={formData.password}
                            onChangeText={t => setFormData({ ...formData, password: t })}
                            rightIcon={showPassword ? "eye-off" : "eye"}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />

                        <InputBox
                            icon="lock-check-outline"
                            placeholder="Confirm Password"
                            secureTextEntry={!showPassword}
                            value={formData.confirmPassword}
                            onChangeText={t => setFormData({ ...formData, confirmPassword: t })}
                        />

                        <TouchableOpacity
                            style={ss.saveBtn}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={ss.saveBtnText}>Save Changes</Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const InputBox = ({ icon, rightIcon, onRightIconPress, ...props }) => (
    <View style={ss.inputBox}>
        <Icon source={icon} size={22} color={AppColors.lightText} />
        <TextInput style={ss.input} placeholderTextColor="#999" {...props} />
        {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress}>
                <Icon source={rightIcon} size={20} color={AppColors.lightText} />
            </TouchableOpacity>
        )}
    </View>
);

const ss = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 56,
        backgroundColor: '#fff',
        elevation: 2,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: AppColors.primaryGreen,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: AppColors.greyBg,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    profileImage: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 3,
        borderColor: AppColors.primaryGreen,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: AppColors.blue,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.darkText,
    },
    profileEmail: {
        fontSize: 14,
        color: AppColors.lightText,
    },
    formSection: {
        padding: 20,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.greyBg,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: AppColors.darkText,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dropdown: {
        backgroundColor: AppColors.greyBg,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
    },
    placeholder: {
        fontSize: 16,
        color: '#999',
    },
    selectedText: {
        fontSize: 16,
        color: AppColors.darkText,
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.dividerGrey,
        marginVertical: 16,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.darkText,
        marginBottom: 12,
    },
    saveBtn: {
        backgroundColor: AppColors.primaryGreen,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        elevation: 3,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Setting;
