import {useCallback ,  useState} from "react";

export function useComponentLayout() {
    const [size, setSize] = useState(null);

    const onLayout = useCallback(event => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    }, []);

    return [size, onLayout];
}