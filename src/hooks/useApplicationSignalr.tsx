import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useRef, useState} from "react";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {BASE_URL} from "../services/config";
import {
    setDecrementRealtimeCount,
    setDeletePinnedApplication,
    setPinnedApplication,
    setRealtimeCounts
} from "../reducers/application/actions";
import {Audio, } from "expo-av";
import * as React from "react";

function useApplicationSignalr() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const realtimecounts = useSelector((state: RootStateOrAny) => state.application.realtimecounts);
    const signalr = useRef<HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState('');
    const playbackInstance:any=React.useRef(null);

    const initSignalR = useCallback(async () => {
        signalr.current = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}/applicationhub`, {
                transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
                accessTokenFactory: () => user.sessionToken
            })
            .withAutomaticReconnect()
            .build();
        signalr.current.onclose(() => setConnectionStatus('disconnected'));
        signalr.current.onreconnected(() => setConnectionStatus('connected'));
        signalr.current.onreconnecting(() => setConnectionStatus('reconnecting'));
        signalr.current.start().then(() => setConnectionStatus('connected'));
    }, []);
    const destroySignalR = useCallback(() => {
        signalr.current?.stop();
    }, []);

    const onConnection = useCallback((connection, callback = () => {
        }) =>
            signalr.current?.on(connection, callback),
        []);


    async function onAddApplication(id, data) {
        try {
            try {
                if (playbackInstance?.current != null) {
                    await playbackInstance?.current?.unloadAsync();
                    // this.playbackInstance.setOnPlaybackStatusUpdate(null);
                    playbackInstance.current = null;
                }
                const { sound, status } = await Audio.Sound.createAsync(
                    require('@assets/sound/notification_sound.mp3'),
                    {shouldPlay: true}
                );

                console.log(status, "status")
                playbackInstance.current = sound;
            }catch (e){
                console.log(e)
            }


        } catch (e) {
            console.log(e)
        }


        let pinnedApplication = JSON.parse(data)

        if(pinnedApplication?.region?.value){
            pinnedApplication.region = pinnedApplication.region?.value
        }

        dispatch(setRealtimeCounts(1))
        dispatch(setPinnedApplication(pinnedApplication))
    }
    useEffect(()=>{
        return  () => {
            destroySignalR()
            playbackInstance.current?.unloadAsync()
        }
    }, [])


    async function onDeleteApplication(id) {
        try {
            try {
                if (playbackInstance?.current != null) {
                    await playbackInstance?.current?.unloadAsync();
                    // this.playbackInstance.setOnPlaybackStatusUpdate(null);
                    playbackInstance.current = null;
                }
                const {sound, status} = await Audio.Sound.createAsync(
                    require('@assets/sound/delete.mp3'),
                    {shouldPlay: true}
                );

                console.log(status, "status")
                playbackInstance.current = sound;
            } catch (e) {
                console.log(e)
            }


        } catch (e) {
            console.log(e)
        }
        dispatch(setDecrementRealtimeCount(1))
        dispatch(setDeletePinnedApplication(id))
    }

    return {
        initSignalR,
        onAddApplication,
        onConnection,
        destroySignalR,
        onDeleteApplication
    };
}

export default useApplicationSignalr
