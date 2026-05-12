import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, ActivityIndicator, Switch } from 'react-native';
import { Icon } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getAllSessionsOfFarmerLand, HandlePublicSession, getSessionPerformedActivities, BASE_URL } from '../api';

const ViewCrop = ({ navigation, route }) => {
    const { title, land_id } = route.params || { title: "My Crops" };
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [publicMap, setPublicMap] = useState({});
    const [togglingSet, setTogglingSet] = useState(new Set());
    const [activitiesMap, setActivitiesMap] = useState({}); // { [sessionId]: activity[] }
    const [loadingActivities, setLoadingActivities] = useState(new Set());

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                if (!land_id) {
                    setError("No land ID provided.");
                    setLoading(false);
                    return;
                }
                const data = await getAllSessionsOfFarmerLand(land_id);
                if (data && Array.isArray(data)) {
                    const formattedCrops = data.map(r => ({
                        id: r.Session_id,
                        name: r.Crop || 'Unknown',
                        variety: r.seed_name || 'N/A',
                        sown: r.Sowing_date ? r.Sowing_date : 'N/A',
                        harvest: r.Harvesting_date ? r.Harvesting_date : 'N/A',
                        yield: (r.Profit === "Yes" ? "+" : "-") + (r.Revenue || "0"),
                        quantity: (r.Production || '0') + " Ton",
                        activities: r.activities || [],
                        image: r.Crop_image,
                        isPublic: r.Public === 1,
                    }));
                    setCrops(formattedCrops);
                    // Initialise publicMap from API data
                    const map = {};
                    formattedCrops.forEach(c => { map[c.id] = c.isPublic; });
                    setPublicMap(map);
                } else if (data === "No Session Found against this land id") {
                    setCrops([]);
                } else {
                    setCrops([]);
                }
            } catch (err) {
                if (typeof err === 'string' && err.includes("No Session Found")) {
                    setCrops([]);
                } else {
                    setError(err.toString());
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, [land_id]);

    const filteredCrops = crops.filter(crop =>
        (crop.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (crop.variety || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderRightActions = () => {
        return (
            <View style={styles.editAction}>
                <Icon source="pencil-outline" size={hp('3%')} color="#1ED760" />
            </View>
        );
    };

    const toggleExpand = async (id) => {
        const isOpening = expandedCard !== id;
        setExpandedCard(isOpening ? id : null);

        // Lazy-fetch activities on first open
        if (isOpening && activitiesMap[id] === undefined) {
            setLoadingActivities(prev => new Set(prev).add(id));
            try {
                const data = await getSessionPerformedActivities(id);
                setActivitiesMap(prev => ({
                    ...prev,
                    [id]: Array.isArray(data) ? data : []
                }));
            } catch {
                setActivitiesMap(prev => ({ ...prev, [id]: [] }));
            } finally {
                setLoadingActivities(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        }
    };

    const handleToggleCropPublic = async (sessionId, currentValue) => {
        if (togglingSet.has(sessionId)) return;
        // Optimistic update
        setPublicMap(prev => ({ ...prev, [sessionId]: !currentValue }));
        setTogglingSet(prev => new Set(prev).add(sessionId));
        try {
            await HandlePublicSession(sessionId);
        } catch (error) {
            // Revert on failure
            setPublicMap(prev => ({ ...prev, [sessionId]: currentValue }));
            console.error('Failed to toggle public:', error);
        } finally {
            setTogglingSet(prev => {
                const next = new Set(prev);
                next.delete(sessionId);
                return next;
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="chevron-left" size={hp('3.5%')} color="#1E90FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: wp('8%') }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.filterContainer}>
                    <View style={styles.searchBar}>
                        <Icon source="magnify" size={hp('2.5%')} color="#ccc" />
                        <TextInput
                            placeholder="Search Crops"
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={styles.yearDropdown}>
                        <Text style={styles.yearText}>Year</Text>
                        <Icon source="chevron-down" size={hp('2.5%')} color="#666" />
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#1ED760" />
                        <Text style={{ marginTop: 10, color: '#1ED760' }}>Fetching crop sessions...</Text>
                    </View>
                )}

                {error && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#FF6B6B' }}>Oops! Something went wrong.</Text>
                        <Text style={{ color: '#666', marginTop: 5 }}>{error}</Text>
                    </View>
                )}

                {!loading && !error && crops.length === 0 && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>No crops found.</Text>
                    </View>
                )}

                {!loading && !error && filteredCrops.map((crop) => (
                    <View key={crop.id} style={styles.cardWrapper}>
                        <Swipeable renderRightActions={renderRightActions}>
                            <View style={[styles.cropCard, expandedCard === crop.id && styles.expandedCardBorder]}>
                                <View style={styles.cardTop}>
                                    <View style={styles.cropImagePlaceholder}>
                                        {crop.image ? (
                                            <Image
                                                source={{ uri: crop.image.startsWith('http') ? crop.image : `${BASE_URL}/${crop.image}` }}
                                                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Icon source="barley" size={hp('3.5%')} color="#8D6E63" />
                                        )}
                                    </View>
                                    <View style={styles.cropBasicInfo}>
                                        <View style={styles.nameRow}>
                                            <Text style={styles.cropName}>{crop.name}</Text>
                                            <Text style={styles.cropVariety}> {crop.variety}</Text>
                                        </View>
                                        <Text style={styles.dateLabel}>Sown | {crop.sown}</Text>
                                        <Text style={styles.dateLabel}>Harvest | {crop.harvest}</Text>
                                    </View>
                                    <View style={styles.statContainer}>
                                        <View style={styles.yieldRow}>
                                            <Icon source="seed" size={hp('2%')} color={crop.yield.startsWith('+') ? '#1ED760' : '#FF6B6B'} />
                                            <Text style={[styles.yieldText, { color: crop.yield.startsWith('+') ? '#1ED760' : '#FF6B6B' }]}>{crop.yield}</Text>
                                        </View>
                                        <View style={styles.qtyRow}>
                                            <Icon source="weight-kilogram" size={hp('2%')} color="#1E90FF" />
                                            <Text style={styles.qtyText}>{crop.quantity}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.actionColumn}>
                                        <Switch
                                            value={!!publicMap[crop.id]}
                                            onValueChange={() => handleToggleCropPublic(crop.id, publicMap[crop.id])}
                                            disabled={togglingSet.has(crop.id)}
                                            trackColor={{ false: '#ccc', true: '#1ED76044' }}
                                            thumbColor={publicMap[crop.id] ? '#1ED760' : '#1E90FF'}
                                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                        />

                                        <TouchableOpacity onPress={() => toggleExpand(crop.id)} style={styles.expandBtn}>
                                            <Icon source={expandedCard === crop.id ? "chevron-up" : "chevron-down"} size={hp('3%')} color="#1E90FF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {expandedCard === crop.id && (
                                    <View style={styles.activitySection}>
                                        <Text style={styles.activityTitle}>Performed Activities</Text>
                                        {loadingActivities.has(crop.id) ? (
                                            <ActivityIndicator color="white" style={{ marginVertical: 8 }} />
                                        ) : (activitiesMap[crop.id] || []).length === 0 ? (
                                            <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8 }}>No activities recorded</Text>
                                        ) : (
                                            <>
                                                <View style={styles.tableHeader}>
                                                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Activity</Text>
                                                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Type</Text>
                                                    <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Qty/Acre</Text>
                                                </View>
                                                {(activitiesMap[crop.id] || []).map((act, idx) => (
                                                    <View key={idx} style={styles.tableRow}>
                                                        <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 'bold' }]}>{act['Activity Name']}</Text>
                                                        <Text style={[styles.tableCell, { flex: 1.5 }]}>{act['Activity Type'] || '-'}</Text>
                                                        <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right' }]}>{act['Quantity Per Acre'] ?? '-'}</Text>
                                                    </View>
                                                ))}
                                            </>
                                        )}
                                    </View>
                                )}
                            </View>
                        </Swipeable>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        height: hp('6%'),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: { fontSize: hp('3%'), fontWeight: 'bold', color: '#1ED760' },
    scrollContent: { paddingHorizontal: wp('4%'), paddingBottom: hp('2.5%') },
    filterContainer: {
        flexDirection: 'row',
        marginTop: hp('2%'),
        marginBottom: hp('1.2%'),
        gap: wp('2.5%'),
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1ED760',
        borderRadius: 8,
        paddingHorizontal: wp('2.5%'),
        height: hp('5%'),
    },
    searchInput: { flex: 1, marginLeft: wp('1.2%'), fontSize: hp('1.8%') },
    yearDropdown: {
        width: wp('30%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#1ED760',
        borderRadius: 8,
        paddingHorizontal: wp('2.5%'),
        height: hp('5%'),
    },
    yearText: { color: '#666' },
    cardWrapper: {
        marginTop: hp('2%'),
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        backgroundColor: '#f5f5f5',
    },
    cropCard: {
        backgroundColor: 'white',
        padding: wp('2.5%'),
    },
    expandedCardBorder: {
        borderWidth: 1,
        borderColor: '#1E90FF',
    },
    cardTop: { flexDirection: 'row', alignItems: 'center' },
    cropImagePlaceholder: {
        width: wp('12%'),
        height: wp('12%'),
        backgroundColor: '#fce4ec',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cropBasicInfo: { flex: 1, marginLeft: wp('2.5%') },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    cropName: { fontSize: hp('2%'), fontWeight: 'bold', color: '#333' },
    cropVariety: { fontSize: hp('1.5%'), color: '#999' },
    dateLabel: { fontSize: hp('1.4%'), color: '#999' },
    statContainer: { paddingHorizontal: wp('1.2%') },
    yieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    yieldText: { fontSize: hp('1.6%'), fontWeight: 'bold', marginLeft: 3 },
    qtyRow: { flexDirection: 'row', alignItems: 'center' },
    qtyText: { fontSize: hp('1.6%'), color: '#1E90FF', fontWeight: 'bold', marginLeft: 3 },
    actionColumn: { alignItems: 'center', justifyContent: 'space-between', height: hp('10%') },
    expandBtn: { marginTop: hp('1.2%') },
    editAction: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('15%'),
        height: '100%',
    },
    activitySection: {
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        marginTop: hp('1.2%'),
        padding: wp('4%'),
    },
    activityTitle: { color: 'white', fontSize: hp('2%'), fontWeight: 'bold', marginBottom: hp('1.2%') },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        paddingBottom: hp('0.6%'),
    },
    tableHeaderText: { color: 'white', fontSize: hp('1.8%'), fontWeight: 'bold' },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: hp('1%'),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    tableCell: { color: 'white', fontSize: hp('1.6%') },
});

export default ViewCrop;
