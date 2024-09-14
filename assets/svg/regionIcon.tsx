import * as React from "react";
import Svg, { Path } from "react-native-svg";

const RegionIcon = (props) => (
    <Svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M6.75 15.8719C4.91775 16.3252 3.75 17.011 3.75 17.7785C3.75 19.1435 7.44365 20.25 12 20.25C16.5563 20.25 20.25 19.1435 20.25 17.7785C20.25 17.011 19.0823 16.3252 17.25 15.8719M13.5 9C13.5 9.82843 12.8284 10.5 12 10.5C11.1716 10.5 10.5 9.82843 10.5 9C10.5 8.17157 11.1716 7.5 12 7.5C12.8284 7.5 13.5 8.17157 13.5 9ZM17.25 8.8125C17.25 12 14.25 15.75 12 17.25C9.75 15.75 6.75 12 6.75 8.8125C6.75 6.01656 9 3.75 12 3.75C15 3.75 17.25 6.01656 17.25 8.8125Z"
            stroke={props.color || "#3A52EE"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default RegionIcon;
