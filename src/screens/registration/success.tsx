import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/reducers/user/actions'
import { CheckIcon, ArrowRightIcon } from '@atoms/icon';
import Text from '@atoms/text';
import { text, button } from 'src/styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '32%',
    padding: 30,
  },
  circle: {
    height: 75,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 100,
  },
  whitespace: {
    height: 40,
  },
  text: {
    textAlign: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  }
});

const RegistrationSuccess = ({ navigation, route }:any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onContinue = useCallback(async (data) => {
    setLoading(true);
    await setTimeout(() => {
      setLoading(false);
      dispatch(setUser(data));
      navigation.replace('HomeScreen');
    }, 100);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.content}
      >
        <View style={[styles.circle, { borderColor: text.primary }]}>
          <CheckIcon type={'check'} size={35} color={text.primary} />
        </View>
        <View style={styles.whitespace} />
        <Text
          style={styles.text}
          color={text.primary}
          size={24}
          weight={'500'}
        >
          {'Congratulations!\nyour account has been successfully created.'}
        </Text>
        <View style={styles.whitespace} />
        <Text
          style={[styles.text, { marginHorizontal: 30 }]}
          color={text.default}
          size={16}
        >
          {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pharetra sit amet aliquam id diam maecenas ultricies mi eget.*/}
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={loading}
          onPress={() => onContinue(route.params)}
        >
          <View style={styles.horizontal}>
            <Text
              color={button.primary}
              weight={'500'}
              size={18}
            >
              Continue
            </Text>
            <ArrowRightIcon
              style={{ marginLeft: 5 }}
              color={text.primary}
              size={24}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegistrationSuccess;
