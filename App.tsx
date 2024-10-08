import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor , store} from 'src/services/store';
import Navigation from 'src/navigations';
import TopModal from "@pages/activities/topmodal";
import {MenuProvider} from "react-native-popup-menu";
import {ToastProvider} from "@atoms/toast/ToastProvider";
import {Toast} from "@atoms/toast/Toast";


export default function App() {
    return (
        <Provider store={ store }>
            <PersistGate loading={ null } persistor={ persistor }>
                <ToastProvider>
                <StatusBar/>
                <MenuProvider>

                    <Navigation/>
                </MenuProvider>
                <TopModal/>
                    <Toast />
                </ToastProvider>
            </PersistGate>
        </Provider>
    );
}
