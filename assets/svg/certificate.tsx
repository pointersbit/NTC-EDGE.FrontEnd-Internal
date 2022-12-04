import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const CertificateIcon = (props) => (
    <Svg
        width="32px"
        height="32px"
        viewBox="0 0 32 32"
        enableBackground="new 0 0 32 32"
        id="Layer_3"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
    >
        <G fill={props.color}>
            <Path d="M29,2H3C2.448,2,2,2.447,2,3v18c0,0.553,0.448,1,1,1h13c0.008,0,0.014-0.004,0.022-0.004   c0.216,0.286,0.463,0.544,0.735,0.778c-0.009,0.038-0.031,0.069-0.036,0.108l-0.714,6c-0.046,0.388,0.137,0.767,0.47,0.971   c0.333,0.205,0.754,0.197,1.078-0.021L20,28.202l2.445,1.63C22.613,29.944,22.807,30,23,30c0.181,0,0.362-0.049,0.523-0.147   c0.333-0.204,0.516-0.583,0.47-0.971l-0.714-6c-0.005-0.039-0.027-0.071-0.036-0.108c0.272-0.234,0.519-0.492,0.735-0.778   C23.986,21.996,23.992,22,24,22h5c0.552,0,1-0.447,1-1V3C30,2.447,29.552,2,29,2z M28,6.858C26.601,6.494,25.506,5.399,25.142,4H28   V6.858z M6.858,4C6.494,5.399,5.399,6.494,4,6.858V4H6.858z M4,17.142C5.399,17.506,6.494,18.601,6.858,20H4V17.142z M8.91,20   C8.486,17.493,6.507,15.514,4,15.09V8.91C6.507,8.486,8.486,6.507,8.91,4H23.09c0.423,2.507,2.403,4.486,4.91,4.91v6.181   c-1.354,0.229-2.552,0.91-3.437,1.885C23.783,15.226,22.035,14,20,14c-2.757,0-5,2.243-5,5c0,0.342,0.035,0.677,0.101,1H8.91z    M20,22c-1.654,0-3-1.346-3-3s1.346-3,3-3s3,1.346,3,3S21.654,22,20,22z M21.75,26.965l-1.196-0.797   c-0.336-0.225-0.773-0.225-1.109,0l-1.196,0.797l0.379-3.18C19.067,23.911,19.521,24,20,24s0.933-0.089,1.372-0.215L21.75,26.965z    M25.142,20c0.364-1.399,1.459-2.494,2.858-2.858V20H25.142z" />
            <Path d="M13,8h6c0.552,0,1-0.447,1-1s-0.448-1-1-1h-6c-0.552,0-1,0.447-1,1S12.448,8,13,8z" />
            <Path d="M26,11c0-0.553-0.448-1-1-1H7c-0.552,0-1,0.447-1,1s0.448,1,1,1h18C25.552,12,26,11.553,26,11z" />
        </G>
    </Svg>
);
export default CertificateIcon;
