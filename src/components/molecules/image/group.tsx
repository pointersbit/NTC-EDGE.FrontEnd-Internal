import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import lodash from 'lodash';
import ProfileImage from '@components/atoms/image/profile';
import { primaryColor } from '@styles/color';

const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderWidth: 1.5,
    borderColor: 'white',
  },
  topPosition: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomPosition: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  }
});

interface Props {
  participants?: any;
  size?: number;
  textSize?: number;
  backgroundColor?: string;
}

const GroupImage: FC<Props> = ({
  participants = [],
  size = 35,
  textSize = 14,
}) => {
  const imageSize = size / 1.4;
  if (lodash.size(participants) === 1) {
    return (
      <ProfileImage
        image={participants[0]?.profilePicture?.small}
        name={`${participants[0].firstName} ${participants[0].lastName}`}
        size={size}
        textSize={textSize}
      />
    );
  }
  return (
    <View style={{ width: size, height: size }}>
      <View style={styles.topPosition}>
        <ProfileImage
          style={styles.border}
          image={participants[0]?.profilePicture?.small}
          name={`${participants[0].firstName} ${participants[0].lastName}`}
          size={imageSize}
          textSize={textSize/2}
        />
      </View>
      <View style={styles.bottomPosition}>
        <ProfileImage
          style={styles.border}
          image={participants[1]?.profilePicture?.small}
          name={`${participants[1].firstName} ${participants[1].lastName}`}
          size={imageSize}
          textSize={textSize/2}
        />
      </View>
    </View>
  )
}

export default GroupImage
