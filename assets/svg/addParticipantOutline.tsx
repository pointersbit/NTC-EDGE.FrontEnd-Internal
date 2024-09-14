import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const AddParticipantOutlineIcon = (props: SvgProps) => (
    <Svg
        width={21}
        height={22}
        viewBox="0 0 21 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M15.5 10.5C18.5376 10.5 21 12.9624 21 16C21 19.0376 18.5376 21.5 15.5 21.5C12.4624 21.5 10 19.0376 10 16C10 12.9624 12.4624 10.5 15.5 10.5ZM2 11.499L10.8094 11.5002C10.3832 11.9444 10.0194 12.449 9.7323 12.9999L2 12.999L1.89934 13.009C1.77496 13.0343 1.69 13.1018 1.646 13.145C1.6028 13.189 1.53528 13.2733 1.51 13.398L1.5 13.499V15C1.5 16.009 1.95 16.722 2.917 17.242C3.74315 17.6869 4.91951 17.9563 6.18258 17.9951L6.5 18L6.8174 17.9951C7.68108 17.9686 8.5039 17.8342 9.2024 17.6096C9.3264 18.1025 9.5082 18.5726 9.739 19.013C8.6887 19.363 7.53057 19.5 6.5 19.5C3.77787 19.5 0.1647 18.544 0.00545001 15.2296L0 15V13.499C0 12.395 0.896 11.499 2 11.499ZM15.5 12.5016L15.4101 12.5096C15.206 12.5467 15.0451 12.7076 15.0081 12.9117L15 13.0016V15.4996L12.5 15.5L12.4101 15.5081C12.206 15.5451 12.0451 15.706 12.0081 15.9101L12 16L12.0081 16.0899C12.0451 16.294 12.206 16.4549 12.4101 16.4919L12.5 16.5L15 16.4996V19L15.0081 19.0899C15.0451 19.294 15.206 19.4549 15.4101 19.4919L15.5 19.5L15.5899 19.4919C15.794 19.4549 15.9549 19.294 15.9919 19.0899L16 19V16.4996L18.5 16.5L18.5899 16.4919C18.794 16.4549 18.9549 16.294 18.9919 16.0899L19 16L18.9919 15.9101C18.9549 15.706 18.794 15.5451 18.5899 15.5081L18.5 15.5L16 15.4996V13.0016L15.9919 12.9117C15.9549 12.7076 15.794 12.5467 15.5899 12.5096L15.5 12.5016ZM6.5 0.5C8.985 0.5 11 2.515 11 5C11 7.485 8.985 9.5 6.5 9.5C4.015 9.5 2 7.485 2 5C2 2.515 4.015 0.5 6.5 0.5ZM15.5 2.5C17.433 2.5 19 4.067 19 6C19 7.933 17.433 9.5 15.5 9.5C13.567 9.5 12 7.933 12 6C12 4.067 13.567 2.5 15.5 2.5ZM6.5 2C4.846 2 3.5 3.346 3.5 5C3.5 6.654 4.846 8 6.5 8C8.154 8 9.5 6.654 9.5 5C9.5 3.346 8.154 2 6.5 2ZM15.5 4C14.397 4 13.5 4.897 13.5 6C13.5 7.103 14.397 8 15.5 8C16.603 8 17.5 7.103 17.5 6C17.5 4.897 16.603 4 15.5 4Z"
            fill={props.color || "#565961"}
        />
    </Svg>
);

export default AddParticipantOutlineIcon;