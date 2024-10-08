import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
import { defaultColor } from 'src/styles/color';
import { Regular500 } from '@styles/font';

const styles = StyleSheet.create({
  input: {
    padding: 10,
    width: '100%',
    backgroundColor: 'transparent',
    fontFamily: Regular500,
    ...Platform.select({
      web: {
        outlineStyle: 'none'
      }
    }),
    paddingVertical: Platform.OS === 'android' ? 5 : 10,
  }
});

interface Props {
  value?: string;
  secureTextEntry?: boolean;
  placeholder?: string;
  placeholderTextColor?: string;
  style?: any;
  [x: string]: any;
}

export type TextInputRef =  {
  blur: any,
  focus: any,
}

const Input: ForwardRefRenderFunction<TextInputRef, Props> = ({
  value = '',
  style,
  placeholderTextColor = defaultColor,
  secureTextEntry = false,
  placeholder = '',
  ...otherProps
}, ref) => {
  const inputRef:any = useRef(null);
  useImperativeHandle(ref, () => ({
    blur: () => inputRef.current.blur(),
    focus: () => inputRef.current.focus(),
  }));
  return (
    <TextInput

      ref={inputRef}
      style={[styles.input, style]}
      value={value}
      autoCompleteType="off"
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      underlineColorAndroid={'transparent'}
      {...otherProps}
    />
  );
};

export default forwardRef(Input);
