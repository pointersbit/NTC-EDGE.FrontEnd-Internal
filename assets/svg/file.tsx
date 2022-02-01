import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const FileIcon = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.7998 4.79999C4.7998 3.47451 5.87432 2.39999 7.1998 2.39999H12.7027C13.3393 2.39999 13.9497 2.65285 14.3998 3.10294L18.4969 7.19999C18.9469 7.65008 19.1998 8.26053 19.1998 8.89705V19.2C19.1998 20.5255 18.1253 21.6 16.7998 21.6H7.1998C5.87432 21.6 4.7998 20.5255 4.7998 19.2V4.79999ZM7.1998 12C7.1998 11.3373 7.73706 10.8 8.3998 10.8H15.5998C16.2625 10.8 16.7998 11.3373 16.7998 12C16.7998 12.6627 16.2625 13.2 15.5998 13.2H8.3998C7.73706 13.2 7.1998 12.6627 7.1998 12ZM8.3998 15.6C7.73706 15.6 7.1998 16.1373 7.1998 16.8C7.1998 17.4627 7.73706 18 8.3998 18H15.5998C16.2625 18 16.7998 17.4627 16.7998 16.8C16.7998 16.1373 16.2625 15.6 15.5998 15.6H8.3998Z"
            fill={props.fill ? props.fill : "#2A00A2"}
        />
    </Svg>
);

export default FileIcon;
