import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const MoreTabBarIcon = (props:any) => (
    <Svg
        width={35}
        height={35}
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11.1021 17.2177C11.1021 18.6726 9.92267 19.8521 8.46772 19.8521C7.01278 19.8521 5.83331 18.6726 5.83331 17.2177C5.83331 15.7627 7.01278 14.5833 8.46772 14.5833C9.92267 14.5833 11.1021 15.7627 11.1021 17.2177Z"
            fill="#606A80"
        />
        <Path
            d="M20.1344 17.2177C20.1344 18.6726 18.955 19.8521 17.5 19.8521C16.0451 19.8521 14.8656 18.6726 14.8656 17.2177C14.8656 15.7627 16.0451 14.5833 17.5 14.5833C18.955 14.5833 20.1344 15.7627 20.1344 17.2177Z"
            fill="#606A80"
        />
        <Path
            d="M26.5322 19.8521C27.9872 19.8521 29.1666 18.6726 29.1666 17.2177C29.1666 15.7627 27.9872 14.5833 26.5322 14.5833C25.0773 14.5833 23.8978 15.7627 23.8978 17.2177C23.8978 18.6726 25.0773 19.8521 26.5322 19.8521Z"
            fill="#606A80"
        />
        <Rect x={25.6} width={4} height={4} rx={2} fill="#FF0066" />
    </Svg>
);

export default MoreTabBarIcon;
