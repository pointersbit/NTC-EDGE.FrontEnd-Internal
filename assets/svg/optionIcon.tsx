import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const OptionIcon = (props: SvgProps) => (
    <Svg
        width={25}
        height={24}
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M9.61548 13.5C11.1517 13.5 12.439 14.5658 12.7781 15.9983L22.1155 16C22.5297 16 22.8655 16.3358 22.8655 16.75C22.8655 17.1297 22.5833 17.4435 22.2173 17.4932L22.1155 17.5L12.7784 17.5007C12.4396 18.9337 11.1521 20 9.61548 20C8.07893 20 6.79142 18.9337 6.4526 17.5007L3.61548 17.5C3.20127 17.5 2.86548 17.1642 2.86548 16.75C2.86548 16.3703 3.14763 16.0565 3.51371 16.0068L3.61548 16L6.4526 15.9993C6.79142 14.5663 8.07893 13.5 9.61548 13.5ZM9.61548 15C8.85134 15 8.20159 15.4898 7.96301 16.1725L7.94244 16.2352L7.90395 16.3834C7.87874 16.5016 7.86548 16.6242 7.86548 16.75C7.86548 16.9048 7.88559 17.055 7.92333 17.1979L7.96314 17.3279L7.98883 17.3966C8.24603 18.0431 8.87739 18.5 9.61548 18.5C10.3792 18.5 11.0287 18.0107 11.2676 17.3285L11.3077 17.1978L11.2906 17.2581C11.3393 17.0973 11.3655 16.9267 11.3655 16.75C11.3655 16.6452 11.3563 16.5425 11.3386 16.4428L11.3086 16.3057L11.2886 16.2353L11.2418 16.1024C10.9843 15.4565 10.3532 15 9.61548 15ZM16.1155 4C17.6521 4 18.9396 5.06632 19.2784 6.49934L22.1155 6.5C22.5297 6.5 22.8655 6.83579 22.8655 7.25C22.8655 7.6297 22.5833 7.94349 22.2173 7.99315L22.1155 8L19.2784 8.00066C18.9396 9.43368 17.6521 10.5 16.1155 10.5C14.5789 10.5 13.2914 9.43368 12.9526 8.00066L3.61548 8C3.20127 8 2.86548 7.66421 2.86548 7.25C2.86548 6.8703 3.14763 6.55651 3.51371 6.50685L3.61548 6.5L12.9529 6.49833C13.292 5.06582 14.5793 4 16.1155 4ZM16.1155 5.5C15.3514 5.5 14.7016 5.98976 14.463 6.6725L14.4425 6.73515L14.404 6.88337C14.3788 7.0016 14.3655 7.12425 14.3655 7.25C14.3655 7.40483 14.3856 7.55497 14.4234 7.69794L14.4632 7.82787L14.4889 7.89664C14.746 8.54307 15.3774 9 16.1155 9C16.8793 9 17.5287 8.51073 17.7676 7.82852L17.8077 7.69781L17.7906 7.75808C17.8393 7.59729 17.8655 7.4267 17.8655 7.25C17.8655 7.14518 17.8563 7.0425 17.8386 6.94275L17.8086 6.80565L17.7886 6.73529L17.7418 6.60236C17.4843 5.95647 16.8532 5.5 16.1155 5.5Z"
            fill="#212121"
        />
    </Svg>
);

export default OptionIcon;
