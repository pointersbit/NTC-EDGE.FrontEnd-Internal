import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const NewVideoIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(20)}
    height={RFValue(16)}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.75 0.5C13.5449 0.5 15 1.95507 15 3.75V3.923L18.8639 1.605C19.3638 1.30486 20 1.66493 20 2.248V13.75C20 14.333 19.364 14.6931 18.8641 14.3931L15 12.075V12.25C15 14.0449 13.5449 15.5 11.75 15.5H3.25C1.45507 15.5 0 14.0449 0 12.25V3.75C0 1.95507 1.45507 0.5 3.25 0.5H11.75ZM11.75 2H3.25C2.2835 2 1.5 2.7835 1.5 3.75V12.25C1.5 13.2165 2.2835 14 3.25 14H11.75C12.7165 14 13.5 13.2165 13.5 12.25V3.75C13.5 2.7835 12.7165 2 11.75 2ZM18.5 3.5731L15 5.6745V10.3254L18.5 12.4254V3.5731Z"
      fill={props.color || "white"}
    />
  </Svg>
);

export default NewVideoIcon;
