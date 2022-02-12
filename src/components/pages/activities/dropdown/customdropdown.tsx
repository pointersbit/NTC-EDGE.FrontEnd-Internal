import React, {FC, ReactElement, useEffect, useRef, useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import CaretDownIcon from "@assets/svg/caret-down";
import {useOrientation} from "@pages/activities/hooks/useOrientation";
import {Poppins_500Medium} from "@expo-google-fonts/poppins";


interface Props {
    label: string;
    data: any;
    onSelect: (item: any) => void;
}

const CustomDropdown: FC<Props> = ({label, data, onSelect, value}) => {
    const DropdownButton = useRef();
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(undefined);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null)
    const toggleDropdown = (): void => {
        visible ? setVisible(false) : openDropdown();
    };
    useEffect(() => {
        let isCurrent = true
        const _selectedIndex = data?.findIndex((item) => item.value == value)
        if(isCurrent) setSelectedIndex(_selectedIndex)
        if(_selectedIndex ){
            const _selected = data[_selectedIndex]
            if(isCurrent) setSelected(_selected)
            if(_selected) onSelect(_selected)
        }

          return () =>{
              isCurrent = false
          }
    }, [value, selectedIndex])

    const openDropdown = (): void => {
        DropdownButton?.current?.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
            setDropdownTop(py + h);
        });
        setVisible(true);
    };
    const orientation = useOrientation()
    useEffect(()=>{
        setVisible(false);
    }, [orientation])
    const onItemPress = (item: any): void => {
        setSelected(item);
        onSelect(item);

    };

    const renderItem = ({item}: any): ReactElement<any, any> => (
            <TouchableOpacity
                style={[styles.item, {backgroundColor: item.value == selected?.value ? "#EAEAF4" : "rgba(255,255,255,0)",}]}
                onPress={() => onItemPress(item)}>
                <Text style={{

                    fontSize: 15
                }}>{item.label}</Text>
            </TouchableOpacity>
    );

    const renderDropdown = (): ReactElement<any, any> => {
        const flatListRef = useRef()
        return (
            <Modal supportedOrientations={['portrait', 'landscape']}
                   visible={visible}
                   transparent
                   animationType="none">
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    {dropdownTop>0 && <View style={[styles.dropdown, {width: '100%',flex: 1, top: dropdownTop}]}>
                        {data?.length > 0 ? <FlatList
                            style={styles.items}
                            data={data}
                            initialScrollIndex={selectedIndex || 0 || null}
                            ref={flatListRef}
                            onScrollToIndexFailed={({
                                                        index,
                                                        averageItemLength,
                                                    }) => {
                                flatListRef.current?.scrollToOffset({
                                    offset: index * averageItemLength,
                                    animated: true,
                                });
                            }}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        /> : <View style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text>No Data</Text>
                        </View>}
                    </View>}
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <TouchableOpacity
            ref={DropdownButton}
            style={styles.button}
            onPress={toggleDropdown}
        >
            {renderDropdown()}
            <Text style={[styles.buttonText]}>
                {(!!selected && selected?.label) || label}
            </Text>
            <CaretDownIcon style={{
                paddingHorizontal: 20,
                transform: [{
                    rotate: visible ? "0deg" : "180deg"
                }]
            }}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    items: {
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 5
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#EFF0F6',
        height: 50,
        zIndex: 1
    },
    buttonText: {
        flex: 1,
        color: "#6E7191",
        fontFamily: 'Poppins_500Medium' ,
        paddingHorizontal: 20,
        textAlign: 'left',
    },
    icon: {
        marginRight: 10,
    },
    dropdown: {
        marginTop: 5,
        bottom: "15%",
        alignSelf: "center",
        position: 'absolute',

        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(193,202,220,1)",
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 6,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderRadius: 16,

    },
    overlay: {
        paddingHorizontal: 20,
        width: '100%',
        height: '100%',
    },
    item: {

        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
});

export default CustomDropdown;