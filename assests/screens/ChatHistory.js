import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView, View, Text, FlatList, StyleSheet,
    TouchableOpacity, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Icon } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { getChatHistory, createChatSession } from '../api';

const ChatHistory = ({ navigation, route }) => {
    const farmerId = route.params?.id;

    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [questionText, setQuestionText] = useState('');

    const fetchHistory = async () => {
        if (!farmerId) { setIsLoading(false); return; }
        try {
            const data = await getChatHistory(farmerId);
            if (Array.isArray(data)) {
                setHistoryList(data);
            } else {
                setHistoryList([]);
            }
        } catch (err) {
            console.log('Error fetching chat history:', err);
            setHistoryList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [farmerId])
    );

    const handleStartNewChat = async () => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            const res = await createChatSession(farmerId);
            if (res && res.session_id) {
                const q = questionText.trim();
                setQuestionText('');
                navigation.navigate('ChatScreen', {
                    sessionId: res.session_id,
                    initialQuestion: q || undefined,
                });
            } else {
                Alert.alert('Error', 'Could not create a chat session.');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to start chat. Please try again.');
            console.log('Create session error:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const renderRightActions = () => (
        <View style={styles.deleteAction}>
            <Icon source="delete-outline" size={24} color="#EF5350" />
        </View>
    );

    const renderItem = ({ item }) => (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate('ChatScreen', { sessionId: item.session_id })
                }
                activeOpacity={0.8}
            >
                <View style={styles.cardLeft}>
                    <View style={styles.cardIconWrapper}>
                        <Icon source="chat-outline" size={22} color="#1ED760" />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardType}>
                            {item.chat_type || 'General'}
                        </Text>
                        <Text style={styles.cardQuestion} numberOfLines={1}>
                            {item.question || 'No messages yet'}
                        </Text>
                        <Text style={styles.cardTime}>{item.time || ''}</Text>
                    </View>
                </View>
                <Icon source="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <SafeAreaView style={styles.container}>


            <View style={styles.body}>
                {/* Bot Intro Card */}
                <View style={styles.botCard}>
                    <View style={styles.botRow}>
                        <View style={styles.botAvatarLarge}>
                            <Icon source="robot-outline" size={hp('7%')} color="#1ED760" />
                        </View>
                        <View style={styles.botSpeechBubble}>
                            <Text style={styles.botSpeechText}>What's in your Mind?</Text>
                        </View>
                    </View>

                    {/* Inline question input */}
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ask your question..."
                            placeholderTextColor="#aaa"
                            value={questionText}
                            onChangeText={setQuestionText}
                        />
                        <TouchableOpacity
                            onPress={handleStartNewChat}
                            disabled={isCreating}
                            style={[styles.sendBtn, isCreating && { opacity: 0.5 }]}
                        >
                            {isCreating
                                ? <ActivityIndicator size="small" color="#1E90FF" />
                                : <Icon source="send" size={hp('3%')} color="#1E90FF" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                {/* History Section */}
                <Text style={styles.sectionTitle}>My History</Text>

                {isLoading ? (
                    <View style={styles.centerLoader}>
                        <ActivityIndicator size="large" color="#1ED760" />
                    </View>
                ) : historyList.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon source="chat-remove-outline" size={hp('7%')} color="#ccc" />
                        <Text style={styles.emptyText}>No Chat History</Text>
                        <Text style={styles.emptySubText}>Start a conversation above!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={historyList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => String(item.session_id || index)}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        height: hp('7%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2,
    },
    headerTitle: {
        fontSize: hp('2.8%'),
        fontWeight: 'bold',
        color: '#1ED760',
    },
    body: {
        flex: 1,
        paddingHorizontal: wp('4%'),
    },
    botCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: wp('4%'),
        marginTop: hp('2%'),
        marginBottom: hp('1.5%'),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    botRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    botAvatarLarge: {
        width: wp('18%'),
        height: wp('18%'),
        borderRadius: wp('9%'),
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1ED76022',
    },
    botSpeechBubble: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: wp('3%'),
        marginLeft: wp('3%'),
        borderWidth: 1,
        borderColor: '#eee',
    },
    botSpeechText: {
        fontSize: hp('2%'),
        color: '#333',
        fontWeight: '500',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1ED760',
        borderRadius: 10,
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        fontSize: hp('2%'),
        color: '#333',
        paddingVertical: hp('0.8%'),
    },
    sendBtn: {
        padding: wp('2%'),
    },
    sectionTitle: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp('1%'),
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        color: '#aaa',
        marginTop: hp('1.5%'),
    },
    emptySubText: {
        fontSize: hp('1.7%'),
        color: '#ccc',
        marginTop: hp('0.5%'),
    },
    listContent: {
        paddingBottom: hp('5%'),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: wp('4%'),
        marginBottom: hp('1.2%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIconWrapper: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3%'),
    },
    cardContent: {
        flex: 1,
    },
    cardType: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'capitalize',
    },
    cardQuestion: {
        fontSize: hp('1.8%'),
        color: '#888',
        marginTop: 2,
    },
    cardTime: {
        fontSize: hp('1.6%'),
        color: '#bbb',
        marginTop: 2,
    },
    deleteAction: {
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('18%'),
        borderRadius: 12,
        marginBottom: hp('1.2%'),
    },
});

export default ChatHistory;
