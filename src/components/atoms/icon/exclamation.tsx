import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons';
import {fontValue} from "@pages/activities/fontValue";

interface Props {
  size?: number;
  color?: string;
  [x: string]: any;
}

const ExclamationIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {
  return (
    <AntDesign
      name="exclamationcircle"
      size={fontValue(size)}
      color={color}
      {...otherProps}
    />
  )
}

export default ExclamationIcon
