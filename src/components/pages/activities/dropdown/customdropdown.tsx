import React, {FC, ReactElement, useEffect, useRef, useState} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    View,
} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";


interface Props {
    label: string;
    data: Array<{ label: string; value: string }>;
    onSelect: (item: { label: string; value: string }) => void;
}

const CustomDropdown: FC<Props> = ({ label, data, onSelect, value }) => {
    const DropdownButton = useRef();
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(undefined);
    const [dropdownTop, setDropdownTop] = useState(0);
   
    const toggleDropdown = (): void => {
        visible ? setVisible(false) : openDropdown();
    };
    useEffect(()=>{
        const _selected = data.find((item) => item.value == value)
        setSelected(_selected)
        onSelect(_selected)

    }, [value])
    const openDropdown = (): void => {
        DropdownButton.current.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
            setDropdownTop(py + h);
        });
        setVisible(true);
    };

    const onItemPress = (item: any): void => {
        setSelected(item);
        onSelect(item);
      //  setVisible(false);
    };

    const renderItem = ({ item }: any): ReactElement<any, any> => (
        <TouchableOpacity style={[styles.item, {backgroundColor: item.value == selected.value ? "#EAEAF4" : "rgba(255,255,255,0)",}]} onPress={() => onItemPress(item)}>
            <Text style={{

              fontSize:15
            }} >{item.label}</Text>
        </TouchableOpacity>
    );

    const renderDropdown = (): ReactElement<any, any> => {
        return (
            <Modal visible={visible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <View style={[styles.dropdown, { flex: 1, top: dropdownTop }]}>
                        {data.length > 0 ? <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        /> : <View style={{  height: "100%", justifyContent: "center",  alignItems: "center"}}>
                            <Text >No Data</Text>
                        </View>}
                    </View>
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
                {(!!selected && selected.label) || label}
            </Text>
            <FontAwesome style={styles.icon} name="chevron-down" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#EFF0F6',
        height: 50,
        zIndex: 1,

    },
    buttonText: {
        flex: 1,
                    color: "#6E7191",
        fontWeight: "500",
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
        width: '90%',
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 0,
        borderColor: "rgba(193,202,220,1)",
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 6,
        shadowOpacity: 1,
        shadowRadius: 2,
        borderRadius: 16,

    },
    overlay: {
        width: '100%',
        height: '100%',
    },
    item: {

        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 8,

        paddingHorizontal: 10,
        paddingVertical: 10,
    },
});

export default CustomDropdown;