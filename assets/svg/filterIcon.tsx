import * as React from "react";
import Svg, { Path } from "react-native-svg";

const FilterIcon = (props) => (
    <Svg
        width={26}
        height={26}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M1 2C1 1.44772 1.44772 1 2 1H18C18.5523 1 19 1.44772 19 2V4.58579C19 4.851 18.8946 5.10536 18.7071 5.29289L12.2929 11.7071C12.1054 11.8946 12 12.149 12 12.4142V15L8 19V12.4142C8 12.149 7.89464 11.8946 7.70711 11.7071L1.29289 5.29289C1.10536 5.10536 1 4.851 1 4.58579V2Z"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default FilterIcon;
