import React, { useState, useEffect, useCallback } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView, View, Text, FlatList, SectionList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Icon } from "react-native-paper";
import { getNeighbourRequest, acceptNeighbourRequest, rejectNeighbourRequest, getNotifications } from '../api';
import { useFocusEffect } from '@react-navigation/native';

// Maps notification_type to icon name and background color
const NOTIFICATION_CONFIG = {
    welcome: { icon: "party-popper", color: "#C8E6C9" },
    login: { icon: "login", color: "#BBDEFB" },
    Settings: { icon: "cog", color: "#B2DFDB" },
    land_added: { icon: "map-marker-plus", color: "#DCEDC8" },
    land_updated: { icon: "map-marker-radius", color: "#FFE082" },
    land_deleted: { icon: "delete", color: "#FFCDD2" },
    session_started: { icon: "sprout", color: "#A5D6A7" },
    activity_completed: { icon: "check-circle", color: "#BBDEFB" },
    activity_postponed: { icon: "clock-outline", color: "#FFE0B2" },
    activity_reminder: { icon: "bell-ring", color: "#FFF9C4" },
    harvest_completed: { icon: "grass", color: "#D7CCC8" },
    neighbor_request: { icon: "account-plus", color: "#E1BEE7" },
    neighbor_accepted: { icon: "account-group", color: "#C5CAE9" },
    general: { icon: "information", color: "#E0E0E0" },
};

const getNotifConfig = (type) => {
    return NOTIFICATION_CONFIG[type] || { icon: "bell", color: "#C8E6C9" };
};

const Notification = ({ navigation, route }) => {
    const farmerId = route?.params?.id;
    const [neighbourRequests, setNeighbourRequests] = useState([]);
    const [generalNotifications, setGeneralNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchAll();
        }, [farmerId])
    );

    const fetchAll = async () => {
        if (!farmerId) return;
        setLoading(true);
        try {
            await Promise.all([fetchRequests(), fetchNotifications()]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const data = await getNeighbourRequest(farmerId);
            if (Array.isArray(data)) {
                const formatted = data.map(req => ({
                    id: req.Neighbour_id.toString(),
                    type: 'request',
                    landName: req.land_name || "Unknown Land",
                    landMark: req.land_mark || "",
                    neighbourName: req.farmer_name || "Unknown",
                    phone: req.phone || "",
                    time: "Pending"
                }));
                setNeighbourRequests(formatted);
            } else {
                setNeighbourRequests([]);
            }
        } catch (error) {
            console.error(error);
            setNeighbourRequests([]);
        }
    };

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications(farmerId);
            if (Array.isArray(data)) {
                // Reverse so latest notifications appear first
                setGeneralNotifications(data.reverse());
            } else {
                setGeneralNotifications([]);
            }
        } catch (error) {
            console.error(error);
            setGeneralNotifications([]);
        }
    };

    const handleAccept = async (id) => {
        try {
            await acceptNeighbourRequest(id);
            Alert.alert("Success", "Request accepted!");
            fetchRequests();
        } catch (error) {
            Alert.alert("Error", typeof error === 'string' ? error : "Failed to accept request");
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectNeighbourRequest(id);
            Alert.alert("Success", "Request rejected.");
            fetchRequests();
        } catch (error) {
            Alert.alert("Error", typeof error === 'string' ? error : "Failed to reject request");
        }
    };

    const renderRequestItem = (item) => (
        <View style={[styles.card, styles.requestCard]}>
            <View style={styles.requestHeader}>
                <View style={styles.avatarPlaceholder}>
                    <Icon source="account" size={wp('8%')} color="#666" />
                </View>
                <View style={styles.infoSection}>
                    <View style={styles.nameRow}>
                        <Text style={styles.landName}>{item.landName}</Text>
                        {item.landMark ? (
                            <>
                                <Text style={styles.divider}> | </Text>
                                <Text style={styles.phoneText}>{item.landMark}</Text>
                            </>
                        ) : null}
                    </View>
                    <View style={styles.nameRow}>
                        <Text style={styles.neighbourName}>{item.neighbourName}</Text>
                        <Text style={styles.divider}> | </Text>
                        <Text style={styles.phoneText}>{item.phone}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleReject(item.id)}
                >
                    <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, styles.acceptBtn]}
                    onPress={() => handleAccept(item.id)}
                >
                    <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderNotificationItem = (notif, index) => {
        const config = getNotifConfig(notif.notification_type);
        return (
            <View
                key={`notif-${index}`}
                style={[styles.notifCard, { backgroundColor: config.color }]}
            >
                <View style={styles.notifIconWrap}>
                    <Icon source={config.icon} size={wp('6%')} color="#555" />
                </View>
                <Text style={styles.notifMessage}>{notif.message}</Text>
            </View>
        );
    };

    const hasContent = neighbourRequests.length > 0 || generalNotifications.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={hp('3%')} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
            </View>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#1ED760" />
                </View>
            ) : !hasContent ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: hp('2.2%'), color: '#999' }}>No notifications.</Text>
                </View>
            ) : (
                <FlatList
                    data={[{ key: 'content' }]}
                    renderItem={() => (
                        <View style={styles.listContent}>
                            {/* Neighbour Requests Section */}
                            {neighbourRequests.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Neighbour Requests</Text>
                                    {neighbourRequests.map((item) => (
                                        <View key={item.id}>
                                            {renderRequestItem(item)}
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* General Notifications Section */}
                            {generalNotifications.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Notifications</Text>
                                    {generalNotifications.map((notif, index) =>
                                        renderNotificationItem(notif, index)
                                    )}
                                </>
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item.key}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FBFBFF" },
    header: {
        flexDirection: "row",
        height: hp('8%'),
        alignItems: "center",
        paddingHorizontal: wp('4%'),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    title: {
        fontSize: hp('3%'),
        fontWeight: "bold",
        color: "#1ED760",
        flex: 1,
        textAlign: 'center',
        marginRight: wp('8%'),
    },
    listContent: {
        padding: wp('4%'),
    },
    sectionTitle: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp('1%'),
        marginTop: hp('0.5%'),
    },
    card: {
        backgroundColor: "#fff",
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        borderRadius: 15,
        elevation: 3,
    },
    requestCard: {
        paddingVertical: hp('2%'),
    },
    requestHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    avatarPlaceholder: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 10,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoSection: {
        marginLeft: wp('4%'),
        flex: 1,
    },
    landName: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        color: '#1E90FF',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.5%'),
    },
    neighbourName: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#1ED760',
    },
    divider: {
        color: '#999',
        fontSize: hp('2%'),
    },
    phoneText: {
        fontSize: hp('1.8%'),
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1%'),
    },
    btn: {
        width: wp('38%'),
        height: hp('5.5%'),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectBtn: {
        backgroundColor: '#F44336',
    },
    acceptBtn: {
        backgroundColor: '#1ED760',
    },
    btnText: {
        color: '#fff',
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
    },
    // General notification styles
    notifCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('3.5%'),
        marginBottom: hp('1.2%'),
        borderRadius: 12,
    },
    notifIconWrap: {
        marginRight: wp('3%'),
    },
    notifMessage: {
        flex: 1,
        fontSize: hp('1.9%'),
        fontWeight: '500',
        color: '#333',
    },
});

export default Notification;