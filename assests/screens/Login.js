// import React, { useEffect, useState } from "react";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
// import { Checkbox } from "react-native-paper";
// import { login } from "../api";
// import { Icon } from "react-native-paper";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const Login = ({ navigation }) => {
//     const [checked, setChecked] = useState(false);
//     const [info, setInfo] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     useEffect(() => {
//         loadSavedCredentials();
//     }, []);
//     const loadSavedCredentials = async () => {
//         try {
//             const savedInfo = await AsyncStorage.getItem('info');
//             const savepassword = await AsyncStorage.getItem('password');
//             const remeberMe = await AsyncStorage.getItem('rememberMe');
//             if (remeberMe === 'true' && savedInfo && savepassword) {
//                 setInfo(savedInfo);
//                 setPassword(savepassword);
//                 setChecked(true);
//             }
//         } catch (error) {
//             console.error("Failed to load saved credentials:", error);
//         }
//     };
//     const saveCredentials = async (info, password, rememberMe) => {
//         try {
//             if (rememberMe) {
//                 await AsyncStorage.setItem('info', info);
//                 await AsyncStorage.setItem('password', password);
//                 await AsyncStorage.setItem('rememberMe', 'true');
//             } else {
//                 await AsyncStorage.removeItem('info');
//                 await AsyncStorage.removeItem('password');
//                 await AsyncStorage.setItem('rememberMe', 'false');
//             }
//         } catch (error) {
//             console.error("Failed to save credentials:", error);
//         }
//     };

//     const handleRememberMeToggle = () => {
//         const newCheckedState = !checked;
//         setChecked(newCheckedState);
//         if (!newCheckedState) {
//             AsyncStorage.removeItem('info');
//             AsyncStorage.removeItem('password');
//             AsyncStorage.setItem('rememberMe', 'false');
//         } else if (info && password) {
//             saveCredentials(info, password, true);

//         }
//         const handleLogin = async () => {
//             if (!info || !password) {
//                 Alert.alert("Error", "Please enter both email/phone and password");
//                 return;
//             }

//             setLoading(true);
//             try {
//                 const data = {
//                     "info": info,
//                     "pwd": password
//                 };
//                 console.log("Login data:", data);

//                 const response = await login(data);

//                 // Save credentials if remember me is checked
//                 if (checked) {
//                     saveCredentials(info, password, true);
//                 } else {
//                     // Clear any existing saved credentials
//                     AsyncStorage.removeItem('info');
//                     AsyncStorage.removeItem('password');
//                     AsyncStorage.removeItem('rememberMe');
//                 }

//                 // Alert.alert("Success", `Welcome back, ${response.name}!`);
//                 navigation.navigate('TabNavigator', { user: response });
//             } catch (error) {
//                 Alert.alert("Login Failed", error.toString());
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const handleInfoChange = async (text) => {
//             setInfo(text);
//             // Update saved info if remember me is checked
//             if (checked) {
//                 saveCredentials(text, password, true);
//             }
//         };

//         const handlePasswordChange = async (text) => {
//             setPassword(text);
//             // Update saved password if remember me is checked
//             if (checked) {
//                 saveCredentials(info, text, true);
//             }
//         };

//         return (
//             <View style={ss.main}>
//                 <View style={ss.title}>
//                     <Text style={ss.titleGreen}>Welcome Back</Text>
//                     <Text style={ss.titleBlue}>🌱 Ready to Grow Smarter?{"\n"}
//                         Login now to continue with KISAN GUIDE 🚜</Text>
//                 </View>
//                 <View>
//                     <View>
//                         <TextInput
//                             style={ss.txtinp}
//                             placeholder="Enter Email or Phone"
//                             value={info}
//                             onChangeText={handleInfoChange}
//                         />
//                     </View>
//                     <View>
//                         <TextInput
//                             style={ss.txtinp}
//                             placeholder="Enter Password"
//                             secureTextEntry
//                             value={password}
//                             onChangeText={handlePasswordChange}
//                         />
//                         <TouchableOpacity
//                             onPress={() => setShowPassword(!showPassword)}
//                             accessibilityLabel={showPassword ? "Hide password" : "Show password"}
//                         >
//                             <Icon
//                                 source={showPassword ? "eye-off" : "eye"}
//                                 size={20}
//                                 color="#939793"
//                             />
//                         </TouchableOpacity>
//                     </View>

//                 </View>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                     <Checkbox status={checked ? 'checked' : 'unchecked'}
//                         uncheckedColor="#1ed75fe8"
//                         color="#1ed75fe8"
//                         onPress={handleRememberMeToggle}
//                     >

//                     </Checkbox>
//                     <Text > Remember me </Text>
//                     <View>
//                         <TouchableOpacity style={{ marginLeft: 20 }}>
//                             <Text> Forget Password ?</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View style={{ marginVertical: 20 }}>
//                     <TouchableOpacity
//                         style={{ backgroundColor: "#1ED760", width: wp('85%'), height: hp('6%'), alignItems: "center", justifyContent: "center", borderRadius: 10 }}
//                         onPress={handleLogin}
//                         disabled={loading}
//                     >
//                         <View>
//                             {loading ? (
//                                 <ActivityIndicator color="white" />
//                             ) : (
//                                 <Text style={{ color: "white", fontSize: hp('2%') }}>LOGIN</Text>
//                             )}
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//                 <View style={{ flexDirection: "row" }}>
//                     <Text>Not have an Account?</Text>
//                     <View>
//                         <TouchableOpacity onPress={() => { navigation.navigate('Signup') }}>
//                             <Text style={{ color: "#1ED760" }}> Create Account </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//             </View >
//         )
//     }

//     const ss = StyleSheet.create({
//         main: { alignItems: "center", paddingVertical: hp('2%') },
//         title: {
//             alignItems: "center", margin: hp('4%')
//         },
//         titleGreen: {
//             fontSize: hp('3.5%'),
//             fontWeight: "bold",
//             color: "#1ED760",
//         },
//         titleBlue: {

//             marginVertical: hp('2%'),
//             color: "#1E90FF",
//             textAlign: "center",
//             fontSize: hp('2%')
//         },
//         txtinp: {
//             padding: wp('2.5%'),
//             width: wp('85%'),
//             height: hp('6%'),
//             borderColor: "#1ed75fe8",
//             borderWidth: 1,
//             borderRadius: 10,
//             margin: wp('1.5%')
//         }
//     })
// }
// export default Login;
import React, { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { Checkbox } from "react-native-paper";
import { login } from "../api";
import { Icon } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
    const [checked, setChecked] = useState(false);
    const [info, setInfo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleRememberMeToggle = () => {
        setChecked(!checked);
    };

    const handleLogin = async () => {
        if (!info || !password) {
            Alert.alert("Error", "Please enter both email/phone and password");
            return;
        }

        setLoading(true);
        try {
            const data = {
                "info": info,
                "pwd": password
            };
            console.log("Login data:", data);

            const response = await login(data);
            console.log("Login response:", response);

            // Navigate and pass the farmer ID if it exists in the response
            const farmerId = response.farmer_id || response.id;
            navigation.navigate('TabNavigator', { id: farmerId, user: response });
        } catch (error) {
            Alert.alert("Login Failed", error.toString());
        } finally {
            setLoading(false);
        }
    };

    const handleInfoChange = async (text) => {
        setInfo(text);
    };

    const handlePasswordChange = async (text) => {
        setPassword(text);
    };

    return (
        <View style={ss.main}>
            <View style={ss.title}>
                <Text style={ss.titleGreen}>Welcome Back</Text>
                <Text style={ss.titleBlue}>🌱 Ready to Grow Smarter?{"\n"}
                    Login now to continue with KISAN GUIDE 🚜</Text>
            </View>

            <View>
                <View>
                    <TextInput
                        style={ss.txtinp}
                        placeholder="Enter Email or Phone"
                        value={info}
                        onChangeText={handleInfoChange}
                        autoCapitalize="none"
                    />
                </View>

                <View style={ss.passwordContainer}>
                    <TextInput
                        style={ss.passwordInput}
                        placeholder="Enter Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={handlePasswordChange}
                    />
                    <TouchableOpacity
                        style={ss.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Icon
                            source={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#020302"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={ss.rowContainer}>
                <View style={ss.checkboxContainer}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        uncheckedColor="#1ed75fe8"
                        color="#1ed75fe8"
                        onPress={handleRememberMeToggle}
                    />
                    <Text style={ss.rememberText}>Remember me</Text>
                </View>

                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={ss.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={ss.buttonContainer}>
                <TouchableOpacity
                    style={ss.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <View>
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={ss.loginButtonText}>LOGIN</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <View style={ss.signupContainer}>
                <Text>Don't have an Account?</Text>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={ss.signupText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const ss = StyleSheet.create({
    main: {
        alignItems: "center",
        paddingVertical: hp('2%'),
        flex: 1,
        backgroundColor: '#fff'
    },
    title: {
        alignItems: "center",
        margin: hp('4%')
    },
    titleGreen: {
        fontSize: hp('3.5%'),
        fontWeight: "bold",
        color: "#1ED760",
    },
    titleBlue: {
        marginVertical: hp('2%'),
        color: "#1E90FF",
        textAlign: "center",
        fontSize: hp('2%')
    },
    txtinp: {
        padding: wp('2.5%'),
        width: wp('85%'),
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        margin: wp('1.5%')
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('85%'),
        height: hp('6%'),
        borderColor: "#1ed75fe8",
        borderWidth: 1,
        borderRadius: 10,
        margin: wp('1.5%'),
        paddingRight: wp('2.5%')
    },
    passwordInput: {
        flex: 1,
        padding: wp('2.5%'),
        height: '100%',
    },
    eyeIcon: {
        padding: wp('2%'),
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: wp('85%'),
        marginTop: hp('1%')
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    rememberText: {
        marginLeft: wp('1%')
    },
    forgotPasswordText: {
        color: "#1ED760"
    },
    buttonContainer: {
        marginVertical: hp('3%')
    },
    loginButton: {
        backgroundColor: "#1ED760",
        width: wp('85%'),
        height: hp('6%'),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    },
    loginButtonText: {
        color: "white",
        fontSize: hp('2%'),
        fontWeight: 'bold'
    },
    signupContainer: {
        flexDirection: "row",
        marginTop: hp('1%')
    },
    signupText: {
        color: "#1ED760",
        fontWeight: 'bold',
        marginLeft: wp('1%')
    }
});

export default Login;