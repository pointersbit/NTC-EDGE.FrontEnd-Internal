import React, { FC } from 'react'
import { Feather } from '@expo/vector-icons';

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const PhoneIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <Feather
      name="phone"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default PhoneIcon
