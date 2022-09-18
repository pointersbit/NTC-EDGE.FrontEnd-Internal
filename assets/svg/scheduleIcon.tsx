import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ScheduleIcon = (props) => (
    <Svg
        width={props.width || "48px"}
        height={props.height || "48px"}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M12 5C12 4.44772 12.4477 4 13 4C13.5523 4 14 4.44772 14 5V11C14 11.5523 13.5523 12 13 12C12.4477 12 12 11.5523 12 11V5Z"
            fill={props.color || "#333333"}
        />
        <Path
            d="M28 5C28 4.44772 28.4477 4 29 4C29.5523 4 30 4.44772 30 5V11C30 11.5523 29.5523 12 29 12C28.4477 12 28 11.5523 28 11V5Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 23H12L12 25H14V23ZM12 21C10.8954 21 10 21.8954 10 23V25C10 26.1046 10.8954 27 12 27H14C15.1046 27 16 26.1046 16 25V23C16 21.8954 15.1046 21 14 21H12Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22 23H20L20 25H22V23ZM20 21C18.8954 21 18 21.8954 18 23V25C18 26.1046 18.8954 27 20 27H22C23.1046 27 24 26.1046 24 25V23C24 21.8954 23.1046 21 22 21H20Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30 23H28L28 25H30V23ZM28 21C26.8954 21 26 21.8954 26 23V25C26 26.1046 26.8954 27 28 27H30C31.1046 27 32 26.1046 32 25V23C32 21.8954 31.1046 21 30 21H28Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 31H12L12 33H14V31ZM12 29C10.8954 29 10 29.8954 10 31V33C10 34.1046 10.8954 35 12 35H14C15.1046 35 16 34.1046 16 33V31C16 29.8954 15.1046 29 14 29H12Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22 31H20L20 33H22V31ZM20 29C18.8954 29 18 29.8954 18 31V33C18 34.1046 18.8954 35 20 35H22C23.1046 35 24 34.1046 24 33V31C24 29.8954 23.1046 29 22 29H20Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 10H33C34.1046 10 35 10.8954 35 12V28C35.6906 28 36.3608 28.0875 37 28.252V12C37 9.79086 35.2091 8 33 8H9C6.79086 8 5 9.79086 5 12V36C5 38.2091 6.79086 40 9 40H28.0703C27.7122 39.381 27.4347 38.7095 27.252 38H9C7.89543 38 7 37.1046 7 36V12C7 10.8954 7.89543 10 9 10Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M36 19H6V17H36V19Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M35 42C38.3137 42 41 39.3137 41 36C41 32.6863 38.3137 30 35 30C31.6863 30 29 32.6863 29 36C29 39.3137 31.6863 42 35 42ZM35 44C39.4183 44 43 40.4183 43 36C43 31.5817 39.4183 28 35 28C30.5817 28 27 31.5817 27 36C27 40.4183 30.5817 44 35 44Z"
            fill={props.color || "#333333"}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M35 31.1787C35.5523 31.1787 36 31.6264 36 32.1787V36.4768L38.4515 38.1785C38.9052 38.4934 39.0177 39.1165 38.7027 39.5702C38.3878 40.0239 37.7647 40.1364 37.311 39.8215L34 37.5232V32.1787C34 31.6264 34.4477 31.1787 35 31.1787Z"
            fill={props.color || "#333333"}
        />
    </Svg>
);

export default ScheduleIcon;
