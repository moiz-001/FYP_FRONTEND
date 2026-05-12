import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView, View, Text, FlatList, StyleSheet,
    TouchableOpacity, TextInput, KeyboardAvoidingView,
    Platform, ActivityIndicator
} from 'react-native';
import { Icon } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getChatBySession, sendChat } from '../api';

const ChatScreen = ({ navigation, route }) => {
    const { sessionId, initialQuestion } = route.params || {};

    const [chatList, setChatList] = useState([]);
    const [inputText, setInputText] = useState(initialQuestion || '');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        if (!sessionId) { setIsLoading(false); return; }
        try {
            const data = await getChatBySession(sessionId);
            if (Array.isArray(data)) {
                setChatList(data);
            }
        } catch (err) {
            console.log('Error loading chats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 150);
    };

    const handleSend = async () => {
        const question = inputText.trim();
        if (!question || isSending) return;

        // Optimistically add user message + thinking placeholder
        const optimistic = { question, answer: null, _temp: true };
        setChatList(prev => [...prev, optimistic]);
        setInputText('');
        setIsSending(true);
        scrollToBottom();

        try {
            const res = await sendChat({
                chat_session_id: sessionId,
                question,
            });
            setChatList(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                    ...updated[lastIdx],
                    answer: res?.answer || 'No response.',
                    id: res?.id,
                    chat_type: res?.chat_type,
                    time: res?.farmer,
                    _temp: false,
                };
                return updated;
            });
            scrollToBottom();
        } catch (err) {
            setChatList(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    answer: 'Failed to get response. Please try again.',
                    _temp: false,
                };
                return updated;
            });
        } finally {
            setIsSending(false);
        }
    };

    const renderItem = ({ item, index }) => (
        <View key={index} style={styles.messageGroup}>
            {/* User bubble */}
            <View style={styles.userBubbleWrapper}>
                <View style={styles.userBubble}>
                    <Text style={styles.bubbleText}>{item.question}</Text>
                </View>
            </View>

            {/* Bot bubble or thinking */}
            {item.answer !== null && item.answer !== undefined ? (
                <View style={styles.botBubbleWrapper}>
                    <View style={styles.botAvatar}>
                        <Icon source="robot-outline" size={18} color="#fff" />
                    </View>
                    <View style={styles.botBubble}>
                        <Text style={styles.bubbleText}>{item.answer}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.thinkingRow}>
                    <View style={styles.botAvatar}>
                        <Icon source="robot-outline" size={18} color="#fff" />
                    </View>
                    <View style={styles.thinkingBubble}>
                        <ActivityIndicator size="small" color="#1E90FF" />
                        <Text style={styles.thinkingText}>Thinking...</Text>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="chevron-left" size={30} color="#1E90FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ChatBot</Text>
                <View style={{ width: wp('8%') }} />
            </View>

            {/* Messages */}
            {isLoading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color="#1ED760" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={chatList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => String(item.id || index)}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToBottom}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon source="robot-outline" size={hp('8%')} color="#1ED760" />
                            <Text style={styles.emptyText}>Start the conversation!</Text>
                            <Text style={styles.emptySubText}>Ask me anything about your crops.</Text>
                        </View>
                    }
                />
            )}

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={hp('2%')}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask your question..."
                        placeholderTextColor="#aaa"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        style={[styles.sendBtn, isSending && { opacity: 0.5 }]}
                        disabled={isSending}
                    >
                        <Icon source="send" size={hp('3%')} color="#1E90FF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
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
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: wp('4%'),
        paddingBottom: hp('2%'),
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('15%'),
    },
    emptyText: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
        color: '#333',
        marginTop: hp('2%'),
    },
    emptySubText: {
        fontSize: hp('1.8%'),
        color: '#888',
        marginTop: hp('0.5%'),
    },
    messageGroup: {
        marginBottom: hp('1.5%'),
    },
    userBubbleWrapper: {
        alignItems: 'flex-end',
        marginBottom: hp('0.7%'),
    },
    userBubble: {
        backgroundColor: '#1ED760',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.2%'),
        borderRadius: 16,
        borderBottomRightRadius: 2,
        maxWidth: '78%',
    },
    botBubbleWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    botAvatar: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4%'),
        backgroundColor: '#1E90FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%'),
    },
    botBubble: {
        backgroundColor: '#1E90FF',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.2%'),
        borderRadius: 16,
        borderBottomLeftRadius: 2,
        maxWidth: '75%',
    },
    bubbleText: {
        color: '#fff',
        fontSize: hp('2%'),
        lineHeight: hp('2.8%'),
    },
    thinkingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thinkingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f4fd',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1%'),
        borderRadius: 16,
        borderBottomLeftRadius: 2,
    },
    thinkingText: {
        color: '#1E90FF',
        fontSize: hp('1.8%'),
        fontStyle: 'italic',
        marginLeft: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: wp('3%'),
        marginBottom: hp('1.5%'),
        marginTop: hp('0.5%'),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1ED760',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.8%'),
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: hp('2%'),
        maxHeight: hp('12%'),
        color: '#333',
        paddingHorizontal: wp('1%'),
    },
    sendBtn: {
        padding: wp('2%'),
    },
});

export default ChatScreen;
