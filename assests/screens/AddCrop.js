import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
    TextInput, Image, FlatList, Modal, Alert, ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { getAllCrops, getSuggestedCrops, addFarmerCropSession } from '../api';

/**
 * Backend getAllCrops returns objects like:
 *   { id, Name, Image: "http://...full url", Season: "Rabi" | "Kharif" }
 *
 * Season dropdown:  null = show all, "Rabi" = filter Rabi, "Kharif" = filter Kharif
 */

const SEASON_OPTIONS = [
    { label: 'All Seasons', value: null },
    { label: '🌾  Rabi', value: 'Rabi' },
    { label: '🌿  Kharif', value: 'Kharif' },
];

const SEASON_COLOR = { Rabi: '#F59E0B', Kharif: '#10B981' };

const AddCrop = ({ navigation, route }) => {
    const [activeTab, setActiveTab] = useState('suggestions');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [seedName, setSeedName] = useState('');
    const [sessionVisibility, setSessionVisibility] = useState(0);
    const [seasonFilter, setSeasonFilter] = useState(null);   // null | 'Rabi' | 'Kharif'
    const [allCrops, setAllCrops] = useState([]);
    const [suggestionCrops, setSuggestionCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const landId = route.params?.id;

    /* ── Fetch ─────────────────────────────────────────────── */
    useEffect(() => {
        const fetchCrops = async () => {
            setLoading(true);
            try {
                const cropsData = await getAllCrops();
                if (Array.isArray(cropsData)) setAllCrops(cropsData);

                if (landId) {
                    const suggestData = await getSuggestedCrops(landId);
                    if (suggestData?.data?.recommendations) {
                        setSuggestionCrops(suggestData.data.recommendations);
                    }
                }
            } catch (err) {
                console.error('Error fetching crops:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, [landId]);

    /* ── Filtered lists ────────────────────────────────────── */
    const filteredAllCrops = allCrops.filter(crop => {
        const nameMatch = (crop.Name ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        const seasonMatch = !seasonFilter || crop.Season === seasonFilter;
        return nameMatch && seasonMatch;
    });

    const filteredSuggestions = suggestionCrops.filter(crop =>
        (crop.Name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ── Submit ────────────────────────────────────────────── */
    const handleAddCrop = async () => {
        if (!seedName.trim()) {
            Alert.alert('Validation', 'Please enter a seed / variety name');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                seed: seedName.trim(),
                land_id: landId,
                crop_id: selectedCrop?.id,
            };
            await addFarmerCropSession(payload);
            Alert.alert('Success', 'Crop session added successfully!');
            setSelectedCrop(null);
            setSeedName('');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', String(err));
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Render helpers ────────────────────────────────────── */
    const SeasonBadge = ({ season }) => (
        <View style={[styles.seasonBadge, { backgroundColor: SEASON_COLOR[season] ?? '#6B7280' }]}>
            <Text style={styles.seasonBadgeText}>{season}</Text>
        </View>
    );

    const CropImage = ({ uri, style }) =>
        uri
            ? <Image source={{ uri }} style={style} resizeMode="cover" />
            : <View style={[style, styles.imagePlaceholder]}>
                <Icon source="sprout" size={Math.round(hp('3%'))} color="#1ED760" />
            </View>;

    const renderGridItem = ({ item }) => (
        <TouchableOpacity
            style={styles.gridCard}
            onPress={() => { setSelectedCrop(item); setSeedName(''); }}
            activeOpacity={0.85}
        >
            <CropImage uri={item.Image} style={styles.gridImage} />
            <View style={styles.gridInfo}>
                <Text style={styles.gridName} numberOfLines={1}>{item.Name}</Text>
                <SeasonBadge season={item.Season} />
            </View>
        </TouchableOpacity>
    );

    const renderSuggestionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.suggestionCard}
            onPress={() => { setSelectedCrop(item); setSeedName(''); }}
            activeOpacity={0.85}
        >
            <CropImage uri={item.Image} style={styles.suggestionImage} />
            <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionName}>{item.Name}</Text>
                <Text style={styles.suggestionSub}>{item.Season} Season</Text>
            </View>
            <Icon source="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity>
    );

    const activeLabel = seasonFilter ? `${seasonFilter} Crops` : 'All Crops';

    /* ── UI ────────────────────────────────────────────────── */
    return (
        <SafeAreaView style={styles.container}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon source="chevron-left" size={30} color="#1E90FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Crop</Text>
                <View style={{ width: wp('8%') }} />
            </View>

            {/* ── Tabs ── */}
            <View style={styles.tabRow}>
                {['suggestions', 'all'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => { setActiveTab(tab); setSearchQuery(''); setSeasonFilter(null); }}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab === 'suggestions' ? 'Suggestions' : 'All Crops'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ flex: 1, paddingHorizontal: wp('4%') }}>

                {/* ── Filter Row ── */}
                <View style={styles.filterRow}>
                    <View style={styles.searchBar}>
                        <Icon source="magnify" size={20} color="#aaa" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={activeTab === 'suggestions' ? 'Search suggestions…' : 'Search crops…'}
                            placeholderTextColor="#aaa"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Icon source="close-circle" size={18} color="#aaa" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {activeTab === 'all' && (
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.ddPlaceholder}
                            selectedTextStyle={styles.ddSelected}
                            data={SEASON_OPTIONS}
                            labelField="label"
                            valueField="value"
                            placeholder="Season"
                            value={seasonFilter}
                            onChange={item => setSeasonFilter(item.value)}
                        />
                    )}
                </View>

                {/* ── Content ── */}
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#1ED760" />
                        <Text style={styles.loadingText}>Loading crops…</Text>
                    </View>
                ) : activeTab === 'suggestions' ? (
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionLabel}>Suggested for your land</Text>
                        {filteredSuggestions.length === 0
                            ? <Text style={styles.emptyText}>No suggested crops found.</Text>
                            : <FlatList
                                key="suggestions_list"
                                data={filteredSuggestions}
                                renderItem={renderSuggestionItem}
                                keyExtractor={(item, i) => String(item.id ?? i)}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ gap: hp('1.2%'), paddingBottom: hp('2%') }}
                            />
                        }
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionLabel}>{activeLabel}</Text>
                        {filteredAllCrops.length === 0
                            ? <Text style={styles.emptyText}>No crops found for this season.</Text>
                            : <FlatList
                                key="all_crops_grid"
                                data={filteredAllCrops}
                                renderItem={renderGridItem}
                                keyExtractor={(item, i) => String(item.id ?? i)}
                                numColumns={2}
                                columnWrapperStyle={styles.gridRow}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: hp('3%') }}
                            />
                        }
                    </View>
                )}
            </View>

            {/* ── Add Session Modal ── */}
            <Modal
                visible={selectedCrop !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedCrop(null)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalSheet}>
                        {/* Crop image banner */}
                        {selectedCrop?.Image
                            ? <Image source={{ uri: selectedCrop.Image }} style={styles.modalImage} resizeMode="cover" />
                            : <View style={styles.modalImagePlaceholder}>
                                <Icon source="sprout" size={48} color="#1ED760" />
                            </View>
                        }

                        {/* Crop info */}
                        <View style={styles.modalMeta}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalCropName}>{selectedCrop?.Name}</Text>
                                <SeasonBadge season={selectedCrop?.Season} />
                            </View>
                            <TouchableOpacity onPress={() => setSelectedCrop(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <Icon source="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Form */}
                        <View style={styles.modalForm}>
                            <Text style={styles.formLabel}>Seed Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Super Basmati, Faisalabadi"
                                placeholderTextColor="#bbb"
                                value={seedName}
                                onChangeText={setSeedName}
                            />



                            <TouchableOpacity
                                style={[styles.addBtn, submitting && { opacity: 0.6 }]}
                                onPress={handleAddCrop}
                                disabled={submitting}
                            >
                                {submitting
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.addBtnText}>Add Session</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

/* ── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },

    /* Header */
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp('4%'), height: hp('6.5%'),
        backgroundColor: '#fff',
        borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    },
    headerTitle: { fontSize: hp('2.7%'), fontWeight: '700', color: '#1ED760' },

    /* Tabs */
    tabRow: {
        flexDirection: 'row', padding: wp('3.5%'), gap: wp('3%'),
        backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1, height: hp('5%'), borderRadius: 10,
        borderWidth: 1.5, borderColor: '#1E90FF',
        justifyContent: 'center', alignItems: 'center',
    },
    activeTab: { backgroundColor: '#1ED760', borderColor: '#1ED760' },
    tabText: { color: '#1E90FF', fontSize: hp('1.9%'), fontWeight: '600' },
    activeTabText: { color: '#fff' },

    /* Filter row */
    filterRow: {
        flexDirection: 'row', alignItems: 'center',
        gap: wp('2.5%'), marginVertical: hp('1.5%'),
    },
    searchBar: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: '#1ED760', borderRadius: 10,
        paddingHorizontal: wp('2.5%'), height: hp('5.5%'),
        backgroundColor: '#fff',
    },
    searchInput: { flex: 1, marginLeft: wp('1.5%'), fontSize: hp('1.8%'), color: '#333' },
    dropdown: {
        width: wp('28%'), height: hp('5.5%'),
        borderColor: '#1ED760', borderWidth: 1.5,
        borderRadius: 10, paddingHorizontal: wp('2%'),
        backgroundColor: '#fff',
    },
    ddPlaceholder: { fontSize: hp('1.7%'), color: '#aaa' },
    ddSelected: { fontSize: hp('1.7%'), color: '#333', fontWeight: '600' },

    /* Labels */
    sectionLabel: {
        color: '#374151', fontSize: hp('2%'), fontWeight: '700',
        marginBottom: hp('1.2%'),
    },
    emptyText: { color: '#aaa', textAlign: 'center', marginTop: hp('6%'), fontSize: hp('1.8%') },
    loadingText: { color: '#888', fontSize: hp('1.8%'), marginTop: 10 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    /* Season badge */
    seasonBadge: {
        alignSelf: 'flex-start', borderRadius: 6,
        paddingHorizontal: wp('1.8%'), paddingVertical: 2, marginTop: 4,
    },
    seasonBadgeText: { fontSize: hp('1.3%'), color: '#fff', fontWeight: '700' },

    /* Suggestion cards */
    suggestionCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', padding: wp('3%'),
        borderRadius: 14, elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    },
    suggestionImage: { width: wp('15%'), height: wp('15%'), borderRadius: 10 },
    suggestionInfo: { flex: 1, marginLeft: wp('3%') },
    suggestionName: { fontSize: hp('2%'), fontWeight: '700', color: '#1F2937' },
    suggestionSub: { fontSize: hp('1.6%'), color: '#6B7280', marginTop: 2 },

    /* Grid */
    gridRow: { justifyContent: 'space-between', marginBottom: hp('1.8%') },
    gridCard: {
        width: '48%', backgroundColor: '#fff',
        borderRadius: 14, overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
    },
    gridImage: { width: '100%', height: hp('14%') },
    imagePlaceholder: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#ECFDF5',
    },
    gridInfo: { padding: wp('2.5%') },
    gridName: { fontSize: hp('1.8%'), fontWeight: '700', color: '#1F2937' },

    /* Modal */
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        overflow: 'hidden',
    },
    modalImage: { width: '100%', height: hp('24%') },
    modalImagePlaceholder: {
        width: '100%', height: hp('16%'),
        backgroundColor: '#ECFDF5',
        justifyContent: 'center', alignItems: 'center',
    },
    modalMeta: {
        flexDirection: 'row', alignItems: 'flex-start',
        padding: wp('5%'), paddingBottom: 0,
    },
    modalCropName: { fontSize: hp('2.6%'), fontWeight: '800', color: '#1F2937' },
    modalForm: { padding: wp('5%'), gap: hp('3%') },
    formLabel: { fontSize: hp('1.8%'), color: '#374151', fontWeight: '600' },
    input: {
        borderWidth: 1.5, borderColor: '#D1D5DB',
        borderRadius: 10, paddingHorizontal: wp('3.5%'),
        paddingVertical: hp('1.2%'),
        fontSize: hp('1.9%'), color: '#1F2937',
        backgroundColor: '#F9FAFB',
    },
    addBtn: {
        backgroundColor: '#1ED760',
        paddingVertical: hp('1.8%'),
        borderRadius: 12, alignItems: 'center',
        marginTop: hp('0.5%'), marginBottom: hp('1%'),
    },
    addBtnText: { color: '#fff', fontSize: hp('2.1%'), fontWeight: '800' },
});

export default AddCrop;
