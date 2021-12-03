import React, { FC, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckIcon, CloseIcon } from '@atoms/icon';
import {
  InputField,
  DropdownField
} from '@molecules/form-fields';
import InputStyles from 'src/styles/input-style';
import { text, outline } from 'src/styles/color';
import Text from '@atoms/text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginLeft: 10
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10 ,
  },
  passwordValidationContainer: {
    paddingVertical: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  strengthBar: {
    height: 4,
    borderRadius: 4,
    marginTop: 10,
    flex: 1,
  },
  horizontal: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unchecked: {
    height: 18,
    width: 18,
    backgroundColor: '#DBDFE5',
    borderRadius: 3,
  },
  circle: {
    height: 15,
    width: 15,
    borderColor: outline.default,
    borderWidth: 1.2,
    borderRadius: 15,
    marginRight: 5,
  },
  circleActive: {
    borderColor: outline.primary,
    borderWidth: 5,
  }
});

const companyType = [
  {
    label: 'Radio Station',
    value: 'Radio Station',
  },
  {
    label: 'Aeronautical Station',
    value: 'Aeronautical Station',
  },
  {
    label: 'Aircraft Station',
    value: 'Aircraft Station',
  },
  {
    label: 'Ship Station',
    value: 'Ship Station',
  },
  {
    label: 'Coastal Station',
    value: 'Coastal Station',
  },
  {
    label: 'Public Coastal Station',
    value: 'Public Coastal Station',
  },
  {
    label: 'Public Telecommunications Entities (PTEs)',
    value: 'Public Telecommunications Entities (PTEs)',
  },
  {
    label: 'Government and Private Radio Stations',
    value: 'Government and Private Radio Stations',
  },
  {
    label: 'Individuals and Private and Government Entities',
    value: 'Individuals and Private and Government Entities',
  },
  {
    label: 'Mobile Phone Service Center',
    value: 'Mobile Phone Service Center',
  },
];

const individualType = [
  {
    label: 'Radio Operator',
    value: 'Radio Operator',
  },
  {
    label: 'Dealer of Radio Communication Equipment',
    value: 'Dealer of Radio Communication Equipment',
  },
  {
    label: 'Retailer/Reseller of Radio Communication Equipment',
    value: 'Retailer/Reseller of Radio Communication Equipment',
  },
  {
    label: 'Service Center of Radio Communication Equipment',
    value: 'Service Center of Radio Communication Equipment',
  },
  {
    label: 'Mobile Phone Dealer',
    value: 'Mobile Phone Dealer',
  },
  {
    label: 'Mobile Phone Retailer/Reseller',
    value: 'Mobile Phone Retailer/Reseller',
  },
  {
    label: 'Accredited Radio Dealers/Manufacturers',
    value: 'Accredited Radio Dealers/Manufacturers',
  },
  {
    label: 'Cable TV Operators and Private and Government Entities',
    value: 'Cable TV Operators and Private and Government Entities',
  },
  {
    label: 'Value Added Service (VAS) Provider',
    value: 'Value Added Service (VAS) Provider',
  }
];

const type = [
  {
    label: 'Company',
    value: 'Company',
  },
  {
    label: 'Individual',
    value: 'Individual',
  }
]

interface Props {
  form?: any;
  onChangeValue?: any;
}

const RegistrationForm : FC<Props> = ({ form = {}, onChangeValue = () => {} }) => {
  const validateIcon = (valid:boolean) => {
    if (valid) {
      return (
        <CheckIcon
          color={text.success}
          size={18}
        />
      )
    }
    return (
      <CloseIcon
        color={text.error}
        size={18}
      />
    )
  }
  const validateColor = (valid:boolean) => {
    return valid ? text.success : text.error;
  }
  const renderPasswordChecker = (checked:boolean) => {
    if (checked) {
      return (
        <View
          style={[
            styles.unchecked,
            {
              backgroundColor: text.primary,
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          <CheckIcon
            type="check"
            color="white"
            size={14}
          />
        </View>
      );
    }
    return (
      <View style={styles.unchecked} />
    );
  }
  const passwordMeterColor = (strength:string) => {
    if (strength === 'Average') {
      return '#F8BF24';
    } else if (strength === 'Strong') {
      return '#2C9669';
    }
    return '#DC2626';
  }
  return (
    <View style={styles.container}>
      <View style={styles.typeContainer}>
        <Text color={text.default} size={14}>User Type</Text>
        {
          type.map(item => (
            <TouchableOpacity
              key={item.value}
              onPress={() => onChangeValue('type', item.value)}
            >
              <View style={styles.buttonContainer}>
                <View style={[styles.circle, item.value === form.type.value && styles.circleActive]} />
                <Text color={text.default} size={14}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
      </View>
      <DropdownField
        outlineStyle={InputStyles.outlineStyle}
        items={form.type.value === 'Company' ? companyType : individualType}
        required={true}
        hasValidation={true}
        requiredColor={text.error}
        activeColor={text.primary}
        errorColor={text.error}
        placeholder={{
          label: 'Select a user type...',
          value: null,
          color: 'black',
        }}
        error={form?.userType?.error}
        value={form?.userType?.value}
        onChangeValue={(value: string) => onChangeValue('userType', value)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Username'}
        placeholder="Username"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        error={form?.username?.error}
        requiredColor={text.error}
        value={form?.username?.value}
        onChangeText={(value: string) => onChangeValue('username', value)}
        onSubmitEditing={(event:any) => onChangeValue('username', event.nativeEvent.text)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Email'}
        placeholder="Email address"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={form?.email?.error}
        value={form?.email?.value}
        keyboardType={'email-address'}
        onChangeText={(value: string) => onChangeValue('email', value)}
        onSubmitEditing={(event:any) => onChangeValue('email', event.nativeEvent.text)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Phone'}
        placeholder="Phone number"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={form?.phone?.error}
        value={form?.phone?.value}
        keyboardType={'phone-pad'}
        onChangeText={(value: string) => onChangeValue('phone', value)}
        onSubmitEditing={(event:any) => onChangeValue('phone', event.nativeEvent.text)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Password'}
        placeholder="Password"
        textContentType="oneTimeCode"
        required={true}
        hasValidation={false}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        secureTextEntry={!form?.showPassword?.value}
        error={form?.password?.error}
        value={form?.password?.value}
        onChangeText={(value: string) => onChangeValue('password', value)}
        onSubmitEditing={(event:any) => onChangeValue('password', event.nativeEvent.text)}
      />
      <View style={{ marginBottom: 20, marginTop: 5 }}>
        <Text
          style={InputStyles.text}
          size={12}
          color={text.default}
        >
          Your password must have:
        </Text>
        <View style={styles.passwordValidationContainer}>
          <View style={styles.horizontal}>
            {validateIcon(form?.password?.characterLength)}
            <Text
              style={styles.label}
              size={12}
              color={validateColor(form?.password?.characterLength)}
            >
              8 or more characters
            </Text>
          </View>
          <View style={styles.horizontal}>
            {validateIcon(form?.password?.upperAndLowerCase)}
            <Text
              style={styles.label}
              size={12}
              color={validateColor(form?.password?.upperAndLowerCase)}
            >
              Uppercase and lowercase letters
            </Text>
          </View>
          <View style={styles.horizontal}>
            {validateIcon(form?.password?.atLeastOneNumber)}
            <Text
              style={styles.label}
              size={12}
              color={validateColor(form?.password?.atLeastOneNumber)}
            >
              At least one number
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[InputStyles.text, { fontWeight: '600' }]}
            size={12}
            color={text.default}
          >
            Strength:
          </Text>
          <Text
            style={[InputStyles.text,
              {
                fontWeight: '600',
                color: passwordMeterColor(form?.password?.strength),
              }
            ]}
            size={12}
          >
            {` ${form?.password?.strength || 'Weak'}`}
          </Text>
        </View>
        <View style={styles.horizontal}>
          <View
            style={[
              styles.strengthBar,
              {
                backgroundColor: passwordMeterColor(form?.password?.strength)
              }]
            }
          />
        </View>
      </View>
      <InputField
        inputStyle={InputStyles.text}
        label={'Confirm'}
        placeholder="Confirm password"
        textContentType="oneTimeCode"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        secureTextEntry={!form?.showPassword?.value}
        error={form?.confirmPassword?.error}
        value={form?.confirmPassword?.value}
        onChangeText={(value: string) => onChangeValue('confirmPassword', value)}
        onSubmitEditing={(event:any) => onChangeValue('confirmPassword', event.nativeEvent.text)}
      />
      <View style={[styles.horizontal, { marginTop: 20 }]}>
        <TouchableOpacity onPress={() => onChangeValue('showPassword', !form?.showPassword?.value)}>
          {renderPasswordChecker(form?.showPassword?.value)}
        </TouchableOpacity>
        <Text
          style={[InputStyles.text, styles.label]}
          size={14}
        >
          Show password
        </Text>
      </View>
    </View>
  );
};

export default RegistrationForm;
