import React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

const Intro = ({ navigation }) => {
    return (
        <View style={ss.container}>
            <View style={ss.main}>
                <Text style={ss.titleGreen}>KISAN GUIDE</Text>
                <Text style={ss.titleBlue}>CHATBOT</Text>
            </View>

            <View style={{ alignItems: "center", margin: hp('2%') }}>
                <Image
                    style={ss.image}
                    source={require("../images/Selection.png")}
                />
            </View>
            <View>
                <Text style={{ margin: hp('1%'), marginHorizontal: wp('6%'), fontSize: hp('1.8%') }}>🌾 The World’s First Farmer GPT
                    Guiding You to Grow Better, Smarter, and Faster 🌿</Text>
            </View >
            <View style={{ margin: hp('6%') }}>
                <TouchableOpacity
                    style={{ backgroundColor: "#1ED760", width: wp('80%'), height: hp('5.5%'), alignItems: "center", padding: wp('2.5%'), borderRadius: 10 }}
                    onPress={() => navigation.navigate('Login')}
                >
                    <View>
                        <Text style={{ color: "white", fontSize: hp('2%') }}>Get Started</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const ss = StyleSheet.create({
    main: {
        alignItems: "center",
        margin: hp('4%'),

    },
    container: {
        gap: hp('1%'),
        alignItems: "center",
    },
    image: {
        width: wp('60%'),
        height: wp('60%'),

        borderRadius: 10

    },
    titleGreen: {
        fontSize: hp('3.5%'),
        fontWeight: "bold",
        color: "#1ED760",
    },
    titleBlue: {
        fontSize: hp('3%'),
        fontWeight: "bold",
        color: "#1E90FF",
    },
});

export default Intro;

