import React,{forwardRef,ForwardRefRenderFunction,ReactNode,useEffect,useImperativeHandle,useRef,useState,} from 'react'
import {Dimensions,FlatList,StyleSheet,TouchableOpacity,View} from 'react-native'
import {MicIcon,SpeakerIcon,VideoIcon} from '@components/atoms/icon';

import ConnectingVideo from '@components/molecules/video/connecting'
import Text from '@components/atoms/text';
import AgoraRTC from 'agora-rtc-sdk';
import AddParticipantOutlineIcon from "@assets/svg/addParticipantOutline";
import {useNavigation} from "@react-navigation/native";
import {Menu,MenuOption,MenuOptions,MenuTrigger} from "react-native-popup-menu";
import ChevronUpIcon from "@assets/svg/chevron-up";

const {width,height}=Dimensions.get('window');


// const videoStateMessage = state => {
//   switch (state) {
//     case VideoRemoteState.Stopped:
//       return 'Video is disabled';

//     case VideoRemoteState.Frozen:
//       return 'Connection Issue, Please Wait...';

//     case VideoRemoteState.Failed:
//       return 'Network Error';
//   }
// };

// const videoStateIcon = state => {
//   switch (state) {
//     case VideoRemoteState.Stopped:
//       return <Icon3 name={'videocam-off'} size={40} color={'white'} />;

//     case VideoRemoteState.Frozen:
//       return (
//         <Icon4 name={'network-strength-1-alert'} size={40} color={'red'} />
//       );

//     case VideoRemoteState.Failed:
//       return <Icon4 name={'network-strength-off'} size={40} color={'red'} />;
//   }
// };


const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#565961"
    },
    layoutTwoVideo:{
        flex:1,
        backgroundColor:'black',
    },
    horizontal:{
        flexDirection:'row',
        flex:1,
    },
    vertical:{
        flexDirection:'column',
    },
    video:{
        borderColor:"#1F2022",
        borderWidth:2,
        zIndex:1,
        borderRadius:10,
        overflow:"hidden",
        width:623,
        height:419,
    },
    fullVideo:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    smallVideo:{
        backgroundColor:'#606A80',
        width:width*0.30,
        height:width*0.37,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden',
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.1)',
    },
    videoList:{
        position:'absolute',
        bottom:100,
        width,
    },
    name:{
        textAlign:'center',
        marginTop:5,
    },
    floatingName:{
        position:'absolute',
        bottom:5,
        left:10,
    },
    mic:{
        position:'absolute',
        top:5,
        left:5,
    },
    footer:{
        width:'100%',
        paddingTop:10,
        position:'absolute',
        bottom:30,
    },
});

interface Props{
    loading?:boolean;
    participants?:[];
    meetingParticipants?:[];
    user:any;
    options:any;
    header?:ReactNode;
    agora?:any;
    callEnded?:false;
    message?:string;
    isVoiceCall?:false;
    onEndCall?:any;
    setNotification?:any;
    isGroup?:false;
}

export type VideoLayoutRef={
    joinSucceed:boolean;
    isMute:boolean;
    isSpeakerEnable:boolean;
    isVideoEnable:boolean;
    toggleIsMute:()=>void;
    toggleIsSpeakerEnable:()=>void;
    toggleIsVideoEnable:()=>void;
}

function ParticipantVideo({id}){
    return (
        <View>
            <View nativeID={id} style={{width: 400, height: 400}}></View>
        </View>
    )
}

const VideoLayout:ForwardRefRenderFunction<VideoLayoutRef,Props>=({
                                                                      loading=false,
                                                                      participants=[],
                                                                      meetingParticipants=[],
                                                                      user={},
                                                                      options={},
                                                                      header,
                                                                      agora={},
                                                                      callEnded=false,
                                                                      message='',
                                                                      isVoiceCall=false,
                                                                      onEndCall=()=>{
                                                                      },
                                                                      setNotification=(message:string)=>{
                                                                      },
                                                                      isGroup=false,
                                                                  },ref)=>{
    useImperativeHandle(ref,()=>(
        {
            joinSucceed,
            isMute,
            isSpeakerEnable,
            isVideoEnable,
            toggleIsMute,
            toggleIsSpeakerEnable,
            toggleIsVideoEnable,
        }));
    const [isVideoMuted,setVideoMute]=useState(false);
    const [isAudioMuted,setAudioMute]=useState(false);
    const [activeSpeaker,setActiveSpeaker]=useState(0);
    const [availableCamera,setAvailableCamera]=useState([]);
    const [availableMicrophone,setAvailableMicrophone]=useState([]);
    const [microphone,setMicrophone]=useState(0);
    const [camera,setCamera]=useState(0);
    const [myId,setMyId]=useState<number>(0);
    const client=useRef(AgoraRTC);
    const localStream=useRef();
    const initAgora=async()=>{

        client.current=AgoraRTC.createClient({
            mode:"rtc",
            codec:"vp8",
        });

        client.current.init(agora.appId);
        client.current.join(
            agora.token,
            agora.channelName,
            agora.uid,
            (uid)=>{
                setVideoMute(true);
                setAudioMute(true);
                localStream.current=AgoraRTC.createStream({
                    audio:!isVideoMuted,
                    video:!isAudioMuted,
                });

                // Initialize the local stream
                localStream.current.init(async()=>{
                    // Play the local stream
                    localStream.current.play("me");
                    // Publish the local stream
                    client.current.publish(localStream.current,(error)=>{
                        console.error(error)
                    });
                },(error)=>{
                    setVideoMute(false);
                    setAudioMute(false)
                });
            },
            (error)=>{
                setVideoMute(false);
                setAudioMute(false)
            });

        client.current.on('stream-added',(evt)=>{
            console.log('stream-added');
            client.current.subscribe(evt.stream,handleError)
        });

        client.current.on('stream-subscribed',(evt)=>{
            console.log('stream-subscribed');
            const stream=evt.stream;
            const streamId=String(stream.getId());
            setStreams({
                ...streams,
                [streamId]:{
                    stream:stream,
                    added:false,
                    removed:false,
                },
            })
            stream.setAudioVolume(100);
        });

        client.current.on('stream-removed',(evt)=>{
            console.log('stream-removed');
            const stream=evt.stream;
            const streamId=String(stream.getId());

            setStreams(strs=>{
                strs[streamId].removed=true;
                return {...strs}
            })
        });
        client.current.enableAudioVolumeIndicator();
        client.current.on("volume-indicator",(evt)=>{
            evt.attr.forEach(function(volume,index){
                if(options.uid==volume.uid&&volume.level>5){
                    setActiveSpeaker(myId)

                } else if(options.uid==volume.uid&&volume.level<5){
                    setActiveSpeaker(0)

                }
            });
        });
        client.current.on('stream-unpublished',(evt)=>{
            console.log('stream-unpublished')
        });


        client.current.on("peer-leave",function(evt){
            console.log('peer-leave');
            const stream=evt.stream;
            const streamId=String(stream.getId());

            setStreams(strs=>{
                strs[streamId].removed=true;
                return {...strs}
            })
        });
        getCameraDevices()
        getMicDevices()
    };

    function getCameraDevices(){
        console.log("Checking for Camera Devices.....");
        client.current.getCameras(function(cameras){
            setAvailableCamera(cameras); // store cameras array
        });
    }
    function getMicDevices() {
        console.log("Checking for Mic Devices.....")
        client.current.getRecordingDevices(function(mics) {
            setAvailableMicrophone(mics); // store mics array
        });
    }

    useEffect(()=>{

        if(!loading&&agora.appId){
            initAgora();
        }
        return ()=>{
            client.current=null;
            localStream.current=null
        }
    },[loading,agora.appId]);


    const [streams,setStreams]=useState({});

    const handleError=(error)=>{
        console.error(error)
    };
    const navigation=useNavigation();

    useEffect(async()=>{
        if(!Object.keys(streams).find((streamId)=>!streams[streamId].added||streams[streamId].removed)) return;

        setStreams(strs=>{
            Object.keys(strs).forEach((streamId)=>{
                if(!strs[streamId].added){
                    strs[streamId].added=true;
                    strs[streamId].stream.play(streamId)
                } else if(strs[streamId].removed){
                    strs[streamId].stream.close();
                    delete strs[streamId]
                }
            });
            return {...strs}
        })
    },[streams]);

    function changeStreamSource(deviceIndex,deviceType){
        console.log('Switching stream sources for: '+deviceType);
        var deviceId;
        var existingStream=false;

        if(deviceType==="video"){
            deviceId=availableCamera[deviceIndex].deviceId
        }

        if(deviceType==="audio"){
            deviceId=availableMicrophone[deviceIndex].deviceId;
        }

        localStream.current.switchDevice(deviceType,deviceId,function(){
            console.log('successfully switched to new device with id: '+JSON.stringify(deviceId));
            // set the active device ids
            if(deviceType==="audio"){
                setMicrophone(deviceId);
            } else if(deviceType==="video"){
               setCamera(deviceId);
            } else{
                console.log("unable to determine deviceType: "+deviceType);
            }
        },function(){
            console.log('failed to switch to new device with id: '+JSON.stringify(deviceId));
        });
    }

    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <View>
                <View style={styles.container}>

                    <View style={[styles.video,{position:"absolute",zIndex:2,flex:1,justifyContent:"flex-end"}]}>
                        <View
                            style={{position:"absolute",backgroundColor:"rgba(96, 106, 128, 0.5)",width:643,height:80}}>
                            <View
                                style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                                <View style={{
                                    flexDirection:"row",
                                    gap:(
                                        width*0.43)*0.11,
                                    justifyContent:"center",
                                }}>
                                    <View style={{flexDirection:"row",}}>
                                        <View style={{alignItems:"center"}}>
                                            <TouchableOpacity onPress={()=>{
                                                if(!isVideoMuted){
                                                    localStream.current.unmuteVideo();
                                                    setVideoMute(mute=>!mute);
                                                } else{
                                                    localStream.current.muteVideo();
                                                    setVideoMute(mute=>!mute);
                                                }
                                            }}>
                                                <View style={{paddingBottom:15}}>
                                                    <VideoIcon
                                                        size={25}
                                                        type={'video'}
                                                        color={'white'}
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                            <Text color={"white"}>Video {isVideoMuted ? "On" : "Off"}</Text>
                                        </View>
                                        <Menu>
                                            <MenuTrigger text={<ChevronUpIcon color={"white"}/>}/>
                                            <MenuOptions>
                                                <FlatList
                                                    data={availableCamera}
                                                    renderItem={({item,index})=>
                                                        <MenuOption
                                                            onSelect={()=>changeStreamSource(index,"video")}
                                                            text={item.label}
                                                        />
                                                    }/>

                                            </MenuOptions>
                                        </Menu>

                                    </View>
                                    <View  style={{flexDirection:"row",}} >
                                        <View style={{alignItems:"center"}}>
                                            <TouchableOpacity onPress={async()=>{
                                                if(!isAudioMuted){
                                                    setAudioMute(mute=>!mute);

                                                    localStream.current.unmuteAudio();
                                                } else{
                                                    setAudioMute(mute=>!mute);
                                                    localStream.current.muteAudio();
                                                }
                                            }}>
                                                <View style={{paddingBottom:15}}>
                                                    <MicIcon
                                                        size={25}
                                                        type={!isAudioMuted ? 'muted' : 'mic'}
                                                        color={'white'}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            <Text color={"white"}>Mic {isAudioMuted ? "On" : "Off"}</Text>
                                        </View>
                                        <Menu>
                                            <MenuTrigger text={<ChevronUpIcon color={"white"}/>}/>
                                            <MenuOptions>
                                                <FlatList
                                                    data={availableMicrophone}
                                                    renderItem={({item,index})=>
                                                        <MenuOption
                                                            onSelect={()=>changeStreamSource(index,"audio")}
                                                            text={item.label}
                                                        />
                                                    }/>

                                            </MenuOptions>
                                        </Menu>
                                    </View>

                                    <View style={{alignItems:"center"}}>
                                        <View style={{paddingBottom:15}}>
                                            <SpeakerIcon
                                                size={25}
                                                type={availableMicrophone.length ? '' : 'speaker-off'}
                                                color={'white'}
                                            />
                                        </View>

                                        <Text color={"white"}>Speaker On</Text>
                                    </View>

                                </View>
                                <View style={{alignItems:"center"}}>
                                    <View style={{paddingBottom:15}}>
                                        <AddParticipantOutlineIcon color={"white"}/>
                                    </View>

                                    <Text color={"white"}>Speaker On</Text>
                                </View>

                            </View>

                        </View>
                    </View>
                    <View nativeID={"me"} style={styles.video}>
                        <ConnectingVideo
                            participants={participants}
                            callEnded={callEnded}
                        />
                    </View>


                    {
                        Object.keys(streams).map((streamId)=>{
                            return <ParticipantVideo id={streamId} key={streamId}/>
                        })
                    }
                </View>

            </View>

            <View style={{
                paddingTop:50,
                width:width*0.43,
                justifyContent:"space-between",
                flexDirection:"row",
                alignItems:"center"
            }}>
                <TouchableOpacity onPress={()=>{
                    client.current.leave();
                    localStream.current.disableAudio();
                    localStream.current.disableVideo();
                    localStream.current.muteVideo();
                    localStream.current.stop();
                    localStream.current.close();
                    client.current.unpublish(localStream.current);
                    navigation.goBack()
                }}>
                    <View style={{
                        paddingVertical:16,
                        alignItems:"center",
                        paddingHorizontal:24,
                        width:(
                            width*0.43)*0.48,
                        borderRadius:12,
                        borderWidth:1,
                        borderColor:"white"
                    }}>
                        <Text color={"#fff"}>Cancel</Text>
                    </View>
                </TouchableOpacity>

                <View style={{
                    paddingVertical:16,
                    alignItems:"center",
                    paddingHorizontal:24,
                    width:(
                        width*0.43)*0.48,
                    borderRadius:12,
                    backgroundColor:"#2863D6"
                }}>
                    <Text color={"#fff"}>Start Meeting</Text>
                </View>
            </View>

        </View>


    );
};

export default forwardRef(VideoLayout)
