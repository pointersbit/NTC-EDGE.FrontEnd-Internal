import React,{useRef,useState} from "react";
import {Alert,FlatList,SafeAreaView,StyleSheet,TouchableOpacity,View} from "react-native";
import CloseIcon from "@assets/svg/close";
import Text from '@components/atoms/text'
import {Bold,Regular} from "@styles/font";
import CreateChatIcon from "@assets/svg/createChat";
import {fontValue} from "@pages/activities/fontValue";
import OptionIcon from "@assets/svg/optionIcon";
import {getChannelName} from "../../utils/formatting";
import {removeSelectedMessage,setMessages,updateChannel} from "../../reducers/channel/actions";
import ProfileImage from "@atoms/image/profile";
import {InputField} from "@molecules/form-fields";
import {RootStateOrAny,useDispatch,useSelector} from "react-redux";
import useSignalr from "../../hooks/useSignalr";
import useApi from "../../services/api";
import IParticipants from "../../interfaces/IParticipants";
import {BottomModalRef} from "@atoms/modal/bottom-modal";
import lodash from 'lodash';
import {ContactItem} from "@molecules/list-item";
import {ToggleIcon} from "@atoms/icon";
import {RFValue} from "react-native-responsive-fontsize";

const styles=StyleSheet.create({
    safeAreaView:{
        flex:1,
        top:65,
        backgroundColor:"#fff"
    },

    container:{
        margin:12,
        flex:1
    },
    header:{
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems: "center",
        borderBottomWidth:2,
        borderBottomColor:"#efefef",
        paddingVertical:20,
        paddingHorizontal:20
    },
    headerText:{
        fontSize:14,
        color:"#1F2022",
        textAlign:"center",
        fontWeight:"bold",
        fontFamily:Bold
    },
    text:{
        fontFamily:Regular,fontSize:15,fontWeight:'400',lineHeight:22.5
    },
    muteChatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
});

export const InfoWeb=(props)=>{
    const dispatch=useDispatch();
    const {
        leaveChannel,
    }=useSignalr();
    const user=useSelector((state:RootStateOrAny)=>state.user);
    const api=useApi(user.sessionToken);
    const {_id,otherParticipants=[],participants=[],hasRoomName=false,name='',isGroup=false,muted=false}=useSelector(
        (state:RootStateOrAny)=>{
            const {selectedChannel}=state.channel;
            selectedChannel.otherParticipants=lodash.reject(selectedChannel.participants,(p:IParticipants)=>p._id===user._id);
            selectedChannel.muted= !!lodash.find(selectedChannel.participants,(p:IParticipants)=>p._id===user._id&&p.muted);
            return selectedChannel;
        }
    );
    const [isVideoEnable,setIsVideoEnable]=useState(false);
    const [muteChat,setMuteChat]=useState(muted);
    const [showDeleteOption,setShowDeleteOption]=useState(false);
    const [showAlert,setShowAlert]=useState(false);
    const [loading,setLoading]=useState(false);
    const [alertData,setAlertData]=useState({
        title:'',
        message:'',
        cancel:'',
        confirm:'',
        type:'',
    });
    const [selectedParticipant,setSelectedParticipant]=useState<any>({});
    const [groupName,setGroupName]=useState(name||'');
    const [editName,setEditName]=useState(false);
    const modalRef=useRef<BottomModalRef>(null);
    const participantModal=useRef<BottomModalRef>(null);
    const optionModalRef=useRef<BottomModalRef>(null);
    const newMessageModalRef=useRef<BottomModalRef>(null);
    const meetingModalRef=useRef<BottomModalRef>(null);
    const groupNameRef:any=useRef(null);
    const renderChannelName=()=>{
        return getChannelName({
            otherParticipants,
            hasRoomName,
            name,
            isGroup
        });
    };
    const muteChatRoom=(mute=false)=>{
        setShowAlert(false);
        setLoading(true);
        api.post(`/rooms/${_id}/mute-chat?muted=${mute}`)
        .then((res)=>{
            setLoading(false);
            setMuteChat(mute);
            if(res.data){
                dispatch(updateChannel(res.data));
            }
        })
        .catch(e=>{
            setLoading(false);
            Alert.alert('Alert',e?.message||'Something went wrong.')
        });
    };
    const clearChat=()=>{
        setShowAlert(false);
        setLoading(true);
        api.post(`/rooms/${_id}/clear-chat`)
        .then((res)=>{
            setLoading(false);
            if(res.data){
                dispatch(setMessages(res.data._id,{}));
                dispatch(removeSelectedMessage(res.data._id));
                dispatch(updateChannel(res.data));
            }
        })
        .catch(e=>{
            setLoading(false);
            Alert.alert('Alert',e?.message||'Something went wrong.')
        });
    };

    const onBack=()=>props.close();

    const onInitiateCall=(isVideoEnable=false)=>{
        setIsVideoEnable(isVideoEnable);
        modalRef.current?.open();
    };

    const separator=()=>(
        <View style={{backgroundColor:'#F8F8F8',height:10}}/>
    );
    const renderParticipants = () => {
        return participants.map((item:IParticipants) => (
            <ContactItem
                key={item._id}
                style={{ marginLeft: -15 }}
                image={item?.profilePicture?.thumb}
                imageSize={30}
                textSize={16}
                data={item}
                name={item.name}
                isOnline={item.isOnline}
                contact={item.email || ''}
                rightIcon={
                    item.isAdmin ? (
                        <View style={{ marginRight: -15 }}>
                            <Text
                                color='#606A80'
                                size={12}
                            >
                                Admin
                            </Text>
                        </View>
                    ) : null
                }
                onPress={() => {
                    if (isGroup && item._id != user._id) {
                        //showOption(item);
                    }
                }}
            />
        ))
    }
    return <SafeAreaView style={styles.safeAreaView}>

        <View style={styles.header}>
            <TouchableOpacity onPress={()=>props.close()}>
                <CloseIcon/>
            </TouchableOpacity>
            <View>
                {
                    editName ? (
                        <InputField
                            ref={groupNameRef}
                            placeholder={isGroup ? 'Group name' : 'Chat Name'}
                            containerStyle={styles.groupName}
                            placeholderTextColor={'#C4C4C4'}
                            inputStyle={[styles.inputText,{backgroundColor:'white'}]}
                            outlineStyle={[styles.outlineText,{backgroundColor:'white'}]}
                            value={groupName}
                            onChangeText={setGroupName}
                            returnKeyType={'done'}
                            clearable={false}
                            onBlur={()=>setEditName(false)}
                        />
                    ) : (
                        <Text
                            style={styles.headerText}
                            size={16}
                        >
                            {renderChannelName()}
                        </Text>
                    )
                }
                {
                    isGroup&&(
                        <Text
                            style={styles.subtitle}
                            color={'#606A80'}
                            size={10}
                        >
                            {`${lodash.size(participants)} participants`}
                        </Text>
                    )
                }
            </View>

            <View/>
        </View>
        <View style={{gap:25,paddingVertical:20,paddingHorizontal:20}}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <CreateChatIcon
                    color={"#212121"}
                    height={fontValue(21)}
                    width={fontValue(22)}
                /><View style={{paddingLeft:10}}>
                <Text style={{fontFamily:Regular,fontSize:15,fontWeight:'400',lineHeight:22.5}}>
                    Add Participant
                </Text>
            </View>

            </View>
            <View style={styles.muteChatContainer}>
                <Text size={14}>
                    Mute Chat
                </Text>
                <TouchableOpacity onPress={() => muteChatRoom(!muteChat)}>
                    <ToggleIcon
                        style={muteChat ? styles.toggleActive : styles.toggleDefault}
                        size={(32)}
                    />
                </TouchableOpacity>
            </View>
            <View style={{paddingBottom:20,flexDirection:"row",alignItems:"center"}}>
                <OptionIcon
                    color={"#212121"}
                    height={fontValue(21)}
                    width={fontValue(22)}
                /><View style={{paddingLeft:10}}>
                <Text style={styles.text}>
                    Meeting Options
                </Text>
            </View>
            </View>
            <View>
                {
                    isGroup && (
                        <Text
                            size={14}
                        >
                            {`Participants (${lodash.size(participants)})`}
                        </Text>
                    )
                }
            </View>
            <View>

                {renderParticipants()}
            </View>
        </View>

    </SafeAreaView>
};


