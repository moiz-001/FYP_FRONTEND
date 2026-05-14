import React, { useEffect, useCallback } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';
import { GetCurrentSessionOfFarmer, GetAllNeighboursWithLatestCrop, HandlePublicSession, getSuggestedActivities, BASE_URL } from '../api';


const ViewLand = ({ navigation, route }) => {
    const landName = route.params?.land || 'Land';
    const landId = route.params?.land_id;
    const fid = route.params?.fid;

    const [showActivities, setShowActivities] = React.useState(false);
    const [currentCrop, setCurrentCrop] = React.useState({});
    const [hasCurrentCrop, setHasCurrentCrop] = React.useState(false);
    const [isPublic, setIsPublic] = React.useState(false);
    const [togglingPublic, setTogglingPublic] = React.useState(false);

    const [neighbours, setNeighbours] = React.useState([]);

    const [activities, setActivities] = React.useState([]);
    const [activitiesLoading, setActivitiesLoading] = React.useState(false);
    const [activitiesWeather, setActivitiesWeather] = React.useState(null);
    const [activitiesError, setActivitiesError] = React.useState(null);

    React.useEffect(() => {
        const fetchCurrentCrop = async () => {
            try {
                const data = await GetCurrentSessionOfFarmer(landId);
                if (data) {
                    setHasCurrentCrop(true);
                    setCurrentCrop(data);
                    setIsPublic(data.Public === 1);
                } else {
                    setHasCurrentCrop(false);
                }
            } catch (error) {
                setHasCurrentCrop(false);
            }
        };

        const fetchNeighbours = async () => {
            try {
                const data = await GetAllNeighboursWithLatestCrop(landId);
                if (Array.isArray(data)) {
                    const formatted = data.map((n, idx) => ({
                        id: n.farmer_id + '_' + idx,
                        name: n.farmer_name || 'Unknown',
                        phone: n.Phone || 'N/A',
                        water: n.source_of_water || 'N/A',
                        crop: n.Crop || 'N/A',
                        avatar: n.farmer_image || 'https://via.placeholder.com/50',
                        land_name: n.land_name || 'N/A',
                        land_id: n.land_id
                    }));
                    setNeighbours(formatted);
                } else {
                    setNeighbours([]);
                }
            } catch (error) {
                console.log("Error fetching neighbours:", error);
                setNeighbours([]);
            }
        };

        fetchCurrentCrop();
        if (landId) {
            fetchNeighbours();
        }
    }, [landId]);

    const fetchSuggestedActivities = async (sessionId) => {
        setActivitiesLoading(true);
        setActivitiesError(null);
        try {
            const data = await getSuggestedActivities(sessionId);
            if (data && data.activities) {
                setActivities(data.activities);
                setActivitiesWeather(data.weather || null);
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.log('Error fetching suggested activities:', error);
            setActivitiesError('Failed to load activities');
            setActivities([]);
        } finally {
            setActivitiesLoading(false);
        }
    };

    const toggleActivities = () => {
        const newValue = !showActivities;
        setShowActivities(newValue);
        // Fetch activities when expanding, if we have a session
        if (newValue && currentCrop.session_id) {
            fetchSuggestedActivities(currentCrop.session_id);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#4CAF50';
            case 'postponed': return '#FF9800';
            case 'skipped': return '#9E9E9E';
            case 'pending': return '#2196F3';
            default: return '#666';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return 'check-circle';
            case 'postponed': return 'clock-alert-outline';
            case 'skipped': return 'skip-next-circle-outline';
            case 'pending': return 'circle-outline';
            default: return 'circle-outline';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return { text: 'High', color: '#EF5350' };
            case 'medium': return { text: 'Med', color: '#FF9800' };
            case 'low': return { text: 'Low', color: '#66BB6A' };
            default: return { text: priority || '', color: '#999' };
        }
    };

    const handleTogglePublic = async (newValue) => {
        if (togglingPublic || !currentCrop.session_id) return;
        setIsPublic(newValue);
        setTogglingPublic(true);
        try {
            await HandlePublicSession(currentCrop.session_id);
        } catch (error) {
            // Revert on failure
            setIsPublic(!newValue);
            console.error('Failed to toggle public status:', error);
        } finally {
            setTogglingPublic(false);
        }
    };

    const renderNeighbourCard = (item) => (
        <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('CropHistory', { title: item.name + " Crops", land_id: item.land_id })}
        >
            <View style={styles.neighbourCard}>
                <View style={styles.neighbourHeader}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.neighbourName}>{item.name}</Text>
                        <Text style={styles.neighbourDirection}>{item.crop}</Text>
                    </View>
                </View>

                <View style={styles.neighbourInfo}>
                    <Icon source="phone-outline" size={16} color="#939793" />
                    <Text style={styles.infoText}>{item.phone}</Text>
                </View>

                <Text style={styles.waterText}>{item.water}</Text>

                <View style={styles.neighbourFooter}>
                    <View style={styles.cropInfoMini}>
                        <Icon source="seed" size={16} color="#8D6E63" />
                        <Text style={styles.cropNameMini}>{item.crop}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="chevron-left" size={30} color="#1E90FF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{landName}</Text>

                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon source="menu" size={30} color="#1E90FF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp('2.5%') }}
            >
                {/* Current Crop Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Current Crop</Text>
                    </View>

                    {hasCurrentCrop ? (
                        <View style={styles.cropCard}>
                            <View style={styles.cropMainInfo}>
                                <View style={styles.cropImagePlaceholder}>
                                    {currentCrop.crop_image ? (
                                        <Image
                                            source={currentCrop.crop_image ? { uri: currentCrop.crop_image.startsWith('http') ? currentCrop.crop_image : `${BASE_URL}/${currentCrop.crop_image}` } : require("../images/bold.png")}
                                            style={styles.cropImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Icon source="tree" size={hp('4%')} color="#8D6E63" />
                                    )}
                                </View>


                                <View style={{ flex: 1, marginLeft: 15 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.cropTitle}>
                                            {currentCrop.crop_name || 'N/A'}
                                        </Text>
                                        <Text style={styles.cropSubtitle}>
                                            {' '}{currentCrop.seed_name || 'N/A'}
                                        </Text>
                                    </View>
                                    <Text style={styles.cropStatus}>
                                        {currentCrop.session_status} | {currentCrop.date || 'N/A'}
                                    </Text>
                                </View>

                                {/* Public/Private toggle + Chat icon */}
                                <View style={styles.cropActions}>
                                    <View style={styles.switchRow}>
                                        <Switch
                                            value={isPublic}
                                            onValueChange={handleTogglePublic}
                                            disabled={togglingPublic}
                                            trackColor={{ false: '#ccc', true: '#1ED76044' }}
                                            thumbColor={isPublic ? '#1ED760' : '#1E90FF'}
                                        />
                                        {/* <Text style={[styles.switchLabel, { color: isPublic ? '#1ED760' : '#1E90FF' }]}>
                                            {isPublic ? 'Public' : 'Private'}
                                        </Text> */}
                                    </View>
                                    { /*<TouchableOpacity
                                        style={styles.chatIcon}
                                        onPress={() => navigation.navigate('ChatHistory', { id: fid })}
                                    >
                                        <Icon
                                            source="chat-processing-outline"
                                            size={hp('3.5%')}
                                            color="#1ED760"
                                        />
                                    </TouchableOpacity>*/}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.expandIcon}
                                onPress={toggleActivities}
                            >
                                <Icon
                                    source={showActivities ? "chevron-up" : "chevron-down"}
                                    size={hp('3%')}
                                    color="#1E90FF"
                                />
                            </TouchableOpacity>

                            {showActivities && (
                                <View style={styles.suggestedActivities}>
                                    <View style={styles.activitiesTitleRow}>
                                        <Text style={styles.activitiesTitle}>
                                            Suggested Activities
                                        </Text>
                                        {activitiesWeather && (
                                            <View style={styles.weatherBadge}>
                                                <Icon source="weather-partly-cloudy" size={14} color="#fff" />
                                                <Text style={styles.weatherBadgeText}>
                                                    {activitiesWeather.condition} {activitiesWeather.temperature ? `${activitiesWeather.temperature}°` : ''}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {activitiesLoading ? (
                                        <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="small" color="#fff" />
                                            <Text style={styles.loadingText}>Loading activities...</Text>
                                        </View>
                                    ) : activitiesError ? (
                                        <Text style={styles.errorText}>{activitiesError}</Text>
                                    ) : activities.length === 0 ? (
                                        <Text style={styles.noActivitiesText}>No pending activities</Text>
                                    ) : (
                                        activities.map((activity, index) => {
                                            const priorityInfo = getPriorityLabel(activity.priority);
                                            return (
                                                <View key={activity.suggested_activity_id || index} style={styles.activityItem}>
                                                    <View style={styles.activityLeft}>
                                                        <Icon
                                                            source={getStatusIcon(activity.status)}
                                                            size={20}
                                                            color={getStatusColor(activity.status)}
                                                        />
                                                        <View style={styles.activityInfo}>
                                                            <Text style={styles.activityText}>
                                                                {activity.activity_name}
                                                            </Text>

                                                            <View style={styles.activityMeta}>
                                                                <Text style={styles.activityDate}>
                                                                    {activity.suggested_date || 'TBD'}
                                                                </Text>
                                                                <Text style={styles.activityDayCount}>
                                                                    Day {activity.day_count}
                                                                </Text>
                                                            </View>
                                                            {activity.weather_delay_reason ? (
                                                                <View style={styles.delayReasonRow}>
                                                                    <Icon source="weather-lightning-rainy" size={12} color="#FFD54F" />
                                                                    <Text style={styles.delayReasonText}>
                                                                        {activity.weather_delay_reason}
                                                                    </Text>
                                                                </View>
                                                            ) : null}
                                                        </View>
                                                    </View>
                                                    <View style={styles.activityRight}>
                                                        <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color + '33' }]}>
                                                            <Text style={[styles.priorityText, { color: priorityInfo.color }]}>
                                                                {priorityInfo.text}
                                                            </Text>
                                                        </View>
                                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) + '33' }]}>
                                                            <Text style={[styles.statusText, { color: getStatusColor(activity.status) }]}>
                                                                {activity.status}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    )}
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles.cropCard}>
                            <Text style={styles.noCropText}>
                                No active crop session
                            </Text>
                        </View>
                    )}
                </View>


                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Neighbours</Text>
                    </View>

                    <View style={styles.neighboursGrid}>
                        {neighbours.map(item => (
                            <View key={item.id} style={styles.gridItemWrapper}>
                                {renderNeighbourCard(item)}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        height: hp('6%'),
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp('4%'),
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: hp('3.2%'),
        fontWeight: "bold",
        color: "#1ED760",
    },
    sectionContainer: {
        marginTop: hp('2%'),
        paddingHorizontal: wp('4%'),
    },
    sectionHeader: {
        backgroundColor: 'white',
        padding: wp('2%'),
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0f2f1',
        marginBottom: hp('1.2%'),
    },
    sectionTitle: {
        fontSize: hp('2%'),
        color: '#1E90FF',
        fontWeight: '500',
    },
    cropCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: wp('4%'),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cropMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cropImagePlaceholder: {
        width: wp('15%'),
        height: wp('15%'),
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cropImage: {
        width: '100%',
        height: '100%',
    },

    cropTitle: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
        color: '#333',
    },
    cropSubtitle: {
        fontSize: hp('1.8%'),
        color: '#999',
    },
    cropStatus: {
        fontSize: hp('1.8%'),
        color: '#999',
    },
    noCropText: {
        fontSize: hp('2%'),
        color: '#666',
        textAlign: 'center',
        padding: wp('2%'),
    },
    chatIcon: {
        padding: 5,
    },
    cropActions: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    switchRow: {
        alignItems: 'center',
    },
    switchLabel: {
        fontSize: hp('1.4%'),
        fontWeight: 'bold',
        marginTop: 2,
    },
    expandIcon: {
        alignSelf: 'flex-end',
        marginTop: hp('-1.2%'),
    },
    suggestedActivities: {
        backgroundColor: '#1a3a5c',
        borderRadius: 12,
        marginTop: hp('1.2%'),
        padding: wp('4%'),
    },
    activitiesTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.2%'),
    },
    activitiesTitle: {
        color: 'white',
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
    },
    weatherBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    weatherBadgeText: {
        color: '#fff',
        fontSize: hp('1.4%'),
        marginLeft: 4,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('2%'),
    },
    loadingText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: hp('1.7%'),
        marginLeft: 8,
    },
    errorText: {
        color: '#EF9A9A',
        fontSize: hp('1.7%'),
        textAlign: 'center',
        paddingVertical: hp('1%'),
    },
    noActivitiesText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: hp('1.7%'),
        textAlign: 'center',
        paddingVertical: hp('2%'),
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    activityInfo: {
        marginLeft: 10,
        flex: 1,
    },
    activityText: {
        color: 'white',
        fontSize: hp('1.9%'),
        fontWeight: '600',
    },
    activityMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },
    activityDate: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: hp('1.5%'),
    },
    activityDayCount: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: hp('1.4%'),
        marginLeft: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 1,
    },
    delayReasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    delayReasonText: {
        color: '#FFD54F',
        fontSize: hp('1.3%'),
        marginLeft: 4,
        flex: 1,
    },
    activityRight: {
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    priorityBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: 4,
    },
    priorityText: {
        fontSize: hp('1.3%'),
        fontWeight: 'bold',
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    statusText: {
        fontSize: hp('1.3%'),
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    neighboursGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItemWrapper: {
        width: '48%',
        marginBottom: hp('2%'),
    },
    neighbourCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: wp('1.5%'),
        elevation: 2,
        borderWidth: 1,
        borderColor: '#eee',
    },
    neighbourHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    avatar: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    neighbourName: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#333',
    },
    neighbourDirection: {
        fontSize: hp('1.5%'),
        color: '#999',
    },
    neighbourInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.6%'),
    },
    infoText: {
        fontSize: hp('1.5%'),
        color: '#666',
        marginLeft: wp('1%'),
    },
    waterText: {
        fontSize: hp('1.5%'),
        color: '#1E90FF',
        marginTop: hp('0.5%'),
    },
    neighbourFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1%'),
        borderTopColor: '#eee',
        paddingTop: hp('1%'),
    },
    cropInfoMini: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cropNameMini: {
        fontSize: hp('1.5%'),
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 4,
    }
});

export default ViewLand;