import * as React from "react";
import Svg, {Path, Rect} from "react-native-svg";

const MeetIcon = (props: any) => (
    <Svg
        width={props.width}
        height={props.height}
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M10.2442 10.5779C8.61359 10.5779 7.29169 11.8998 7.29169 13.5304V22.06C7.29169 23.6907 8.61359 25.0125 10.2442 25.0125H18.7738C20.4044 25.0125 21.7264 23.6907 21.7264 22.06V21.1082L26.1694 23.5764C26.4742 23.7458 26.8458 23.7412 27.1463 23.5643C27.447 23.3876 27.6315 23.0649 27.6315 22.7161V12.8804C27.6315 12.5318 27.4471 12.2093 27.1467 12.0324C26.8464 11.8555 26.4749 11.8507 26.17 12.0197L21.7264 14.4838V13.5304C21.7264 11.8998 20.4044 10.5779 18.7738 10.5779H10.2442ZM21.7264 16.7345L25.6631 14.5515V21.0435L21.7264 18.8564V16.7345ZM19.758 13.5304V22.06C19.758 22.6035 19.3174 23.0442 18.7738 23.0442H10.2442C9.70069 23.0442 9.26005 22.6035 9.26005 22.06V13.5304C9.26005 12.9869 9.70069 12.5462 10.2442 12.5462H18.7738C19.3174 12.5462 19.758 12.9869 19.758 13.5304Z"
            fill={props.fill}
        />
        <Path
            d="M9.80631 29.795L9.80843 29.7961L9.81212 29.7979L9.8224 29.8029L9.85452 29.8182C9.88104 29.8307 9.91774 29.8478 9.96439 29.8686C10.0577 29.9102 10.1908 29.967 10.3618 30.0341C10.7038 30.1681 11.1978 30.3427 11.8284 30.5163C13.0893 30.8634 14.8994 31.2068 17.1321 31.21C19.3663 31.2133 21.1778 30.8695 22.4397 30.5205C23.0709 30.3461 23.5653 30.17 23.9076 30.0349C24.0788 29.9673 24.2122 29.9098 24.3055 29.8677C24.3522 29.8467 24.389 29.8295 24.4155 29.8169C24.8575 29.6037 25.1289 28.923 24.9023 28.4719C24.6583 27.9863 24.0671 27.7903 23.5816 28.0338L23.569 28.0399C23.555 28.0466 23.5312 28.0577 23.4979 28.0727C23.4311 28.1027 23.326 28.1483 23.1845 28.2042C22.9015 28.316 22.4733 28.4691 21.9152 28.6234C20.7986 28.9321 19.1655 29.2445 17.135 29.2416C15.1028 29.2387 13.4683 28.9262 12.3507 28.6186C11.7921 28.4648 11.3635 28.3126 11.0801 28.2014C10.9384 28.1459 10.8332 28.1008 10.7663 28.071C10.7328 28.056 10.709 28.045 10.695 28.0383L10.6822 28.0323C10.1957 27.7906 9.60522 27.9887 9.36314 28.4751C9.12095 28.9617 9.3197 29.5528 9.80631 29.795Z"
            fill={props.fill}
        />
        <Path
            d="M11.8265 5.06728C13.0887 4.71693 14.9006 4.37183 17.135 4.37502C19.3681 4.37821 21.1786 4.72308 22.4398 5.07153C23.0705 5.2458 23.5646 5.42118 23.9066 5.55575C24.0776 5.62306 24.2108 5.68021 24.3041 5.72199C24.3508 5.74289 24.3874 5.75995 24.4141 5.77252L24.4462 5.78795L24.4564 5.79299L24.4601 5.79482L24.4616 5.79555C24.4616 5.79555 25.2446 6.25454 24.9034 7.11646C24.6608 7.60192 24.0712 7.7993 23.5854 7.55815L23.5835 7.55725L23.5708 7.55118C23.5569 7.54454 23.533 7.53342 23.4996 7.51845C23.4328 7.48851 23.3275 7.44317 23.1859 7.38744C22.9025 7.27595 22.474 7.12312 21.9156 6.96882C20.7982 6.6601 19.164 6.34629 17.1323 6.34339C15.1021 6.34049 13.4693 6.65408 12.353 6.96394C11.795 7.11883 11.3669 7.27256 11.0839 7.38477C10.9424 7.44086 10.8374 7.48651 10.7706 7.51665C10.7373 7.53172 10.7135 7.54291 10.6996 7.54958L10.6861 7.5561C10.2008 7.80043 9.61028 7.60487 9.36563 7.11971C9.1209 6.63438 9.31593 6.04254 9.80125 5.79781L9.804 5.79643L9.80771 5.79457L9.81804 5.78946L9.85027 5.77386C9.87687 5.76113 9.91365 5.74389 9.96038 5.72279C10.0538 5.68057 10.1871 5.62289 10.3584 5.55499C10.7007 5.41924 11.1953 5.24249 11.8265 5.06728Z"
            fill={props.fill}
        />
        {/* <Rect x={25} width={4} height={4} rx={2} fill="#FF0066"/> */}
    </Svg>
);

export default MeetIcon;
