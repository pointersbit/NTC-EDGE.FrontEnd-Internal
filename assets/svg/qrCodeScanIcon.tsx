import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const QrScanCodeIcon = (props: SvgProps) => {
 return (<Svg
     width={26}
     height={26}
     viewBox="0 0 40 40"
     fill="none"
     xmlns="http://www.w3.org/2000/svg"
     {...props}
 >
  <Path
      d="M21 6.66667C21 6.11439 20.5523 5.66667 20 5.66667C19.4477 5.66667 19 6.11439 19 6.66667H21ZM19 8.33334C19 8.88562 19.4477 9.33334 20 9.33334C20.5523 9.33334 21 8.88562 21 8.33334H19ZM30 25.6667C29.4477 25.6667 29 26.1144 29 26.6667C29 27.219 29.4477 27.6667 30 27.6667V25.6667ZM33.3333 27.6667C33.8856 27.6667 34.3333 27.219 34.3333 26.6667C34.3333 26.1144 33.8856 25.6667 33.3333 25.6667V27.6667ZM20 26.6667V25.6667C19.4477 25.6667 19 26.1144 19 26.6667H20ZM23.3333 27.6667C23.8856 27.6667 24.3333 27.219 24.3333 26.6667C24.3333 26.1144 23.8856 25.6667 23.3333 25.6667V27.6667ZM19 33.3333C19 33.8856 19.4477 34.3333 20 34.3333C20.5523 34.3333 21 33.8856 21 33.3333H19ZM21 15C21 14.4477 20.5523 14 20 14C19.4477 14 19 14.4477 19 15H21ZM20 20H19C19 20.5523 19.4477 21 20 21V20ZM26.6667 32.3333C26.1144 32.3333 25.6667 32.7811 25.6667 33.3333C25.6667 33.8856 26.1144 34.3333 26.6667 34.3333V32.3333ZM33.3333 34.3333C33.8856 34.3333 34.3333 33.8856 34.3333 33.3333C34.3333 32.7811 33.8856 32.3333 33.3333 32.3333V34.3333ZM6.66667 19C6.11439 19 5.66667 19.4477 5.66667 20C5.66667 20.5523 6.11439 21 6.66667 21V19ZM13.3333 21C13.8856 21 14.3333 20.5523 14.3333 20C14.3333 19.4477 13.8856 19 13.3333 19V21ZM20.0167 21C20.569 21 21.0167 20.5523 21.0167 20C21.0167 19.4477 20.569 19 20.0167 19V21ZM26.6833 21C27.2356 21 27.6833 20.5523 27.6833 20C27.6833 19.4477 27.2356 19 26.6833 19V21ZM33.3333 19C32.7811 19 32.3333 19.4477 32.3333 20C32.3333 20.5523 32.7811 21 33.3333 21V19ZM33.35 21C33.9023 21 34.35 20.5523 34.35 20C34.35 19.4477 33.9023 19 33.35 19V21ZM8.33334 7.66667H11.6667V5.66667H8.33334V7.66667ZM12.3333 8.33334V11.6667H14.3333V8.33334H12.3333ZM11.6667 12.3333H8.33334V14.3333H11.6667V12.3333ZM7.66667 11.6667V8.33334H5.66667V11.6667H7.66667ZM8.33334 12.3333C7.96515 12.3333 7.66667 12.0349 7.66667 11.6667H5.66667C5.66667 13.1394 6.86058 14.3333 8.33334 14.3333V12.3333ZM12.3333 11.6667C12.3333 12.0349 12.0349 12.3333 11.6667 12.3333V14.3333C13.1394 14.3333 14.3333 13.1394 14.3333 11.6667H12.3333ZM11.6667 7.66667C12.0349 7.66667 12.3333 7.96515 12.3333 8.33334H14.3333C14.3333 6.86058 13.1394 5.66667 11.6667 5.66667V7.66667ZM8.33334 5.66667C6.86058 5.66667 5.66667 6.86058 5.66667 8.33334H7.66667C7.66667 7.96515 7.96515 7.66667 8.33334 7.66667V5.66667ZM28.3333 7.66667H31.6667V5.66667H28.3333V7.66667ZM32.3333 8.33334V11.6667H34.3333V8.33334H32.3333ZM31.6667 12.3333H28.3333V14.3333H31.6667V12.3333ZM27.6667 11.6667V8.33334H25.6667V11.6667H27.6667ZM28.3333 12.3333C27.9651 12.3333 27.6667 12.0349 27.6667 11.6667H25.6667C25.6667 13.1394 26.8606 14.3333 28.3333 14.3333V12.3333ZM32.3333 11.6667C32.3333 12.0349 32.0349 12.3333 31.6667 12.3333V14.3333C33.1394 14.3333 34.3333 13.1394 34.3333 11.6667H32.3333ZM31.6667 7.66667C32.0349 7.66667 32.3333 7.96515 32.3333 8.33334H34.3333C34.3333 6.86058 33.1394 5.66667 31.6667 5.66667V7.66667ZM28.3333 5.66667C26.8606 5.66667 25.6667 6.86058 25.6667 8.33334H27.6667C27.6667 7.96515 27.9651 7.66667 28.3333 7.66667V5.66667ZM8.33334 27.6667H11.6667V25.6667H8.33334V27.6667ZM12.3333 28.3333V31.6667H14.3333V28.3333H12.3333ZM11.6667 32.3333H8.33334V34.3333H11.6667V32.3333ZM7.66667 31.6667V28.3333H5.66667V31.6667H7.66667ZM8.33334 32.3333C7.96515 32.3333 7.66667 32.0349 7.66667 31.6667H5.66667C5.66667 33.1394 6.86058 34.3333 8.33334 34.3333V32.3333ZM12.3333 31.6667C12.3333 32.0349 12.0349 32.3333 11.6667 32.3333V34.3333C13.1394 34.3333 14.3333 33.1394 14.3333 31.6667H12.3333ZM11.6667 27.6667C12.0349 27.6667 12.3333 27.9651 12.3333 28.3333H14.3333C14.3333 26.8606 13.1394 25.6667 11.6667 25.6667V27.6667ZM8.33334 25.6667C6.86058 25.6667 5.66667 26.8606 5.66667 28.3333H7.66667C7.66667 27.9651 7.96515 27.6667 8.33334 27.6667V25.6667ZM19 6.66667V8.33334H21V6.66667H19ZM30 27.6667H33.3333V25.6667H30V27.6667ZM20 27.6667H23.3333V25.6667H20V27.6667ZM19 26.6667V33.3333H21V26.6667H19ZM19 15V20H21V15H19ZM26.6667 34.3333H33.3333V32.3333H26.6667V34.3333ZM6.66667 21H13.3333V19H6.66667V21ZM20 21H20.0167V19H20V21ZM33.3333 21H33.35V19H33.3333V21ZM20 21H26.6833V19H20V21Z"
      fill="#111827"
  />
 </Svg>)
};

export default QrScanCodeIcon;
