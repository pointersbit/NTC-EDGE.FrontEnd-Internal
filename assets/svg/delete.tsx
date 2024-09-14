import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const DeleteIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 24}
        height={props.height ||24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M10 18.0001C10.2652 18.0001 10.5196 17.8947 10.7071 17.7072C10.8946 17.5197 11 17.2653 11 17.0001V11.0001C11 10.7349 10.8946 10.4805 10.7071 10.293C10.5196 10.1054 10.2652 10.0001 10 10.0001C9.73478 10.0001 9.48043 10.1054 9.29289 10.293C9.10536 10.4805 9 10.7349 9 11.0001V17.0001C9 17.2653 9.10536 17.5197 9.29289 17.7072C9.48043 17.8947 9.73478 18.0001 10 18.0001ZM20 6.00009H16V5.00009C16 4.20444 15.6839 3.44138 15.1213 2.87877C14.5587 2.31616 13.7956 2.00009 13 2.00009H11C10.2044 2.00009 9.44129 2.31616 8.87868 2.87877C8.31607 3.44138 8 4.20444 8 5.00009V6.00009H4C3.73478 6.00009 3.48043 6.10545 3.29289 6.29298C3.10536 6.48052 3 6.73488 3 7.00009C3 7.26531 3.10536 7.51966 3.29289 7.7072C3.48043 7.89473 3.73478 8.00009 4 8.00009H5V19.0001C5 19.7957 5.31607 20.5588 5.87868 21.1214C6.44129 21.684 7.20435 22.0001 8 22.0001H16C16.7956 22.0001 17.5587 21.684 18.1213 21.1214C18.6839 20.5588 19 19.7957 19 19.0001V8.00009H20C20.2652 8.00009 20.5196 7.89473 20.7071 7.7072C20.8946 7.51966 21 7.26531 21 7.00009C21 6.73488 20.8946 6.48052 20.7071 6.29298C20.5196 6.10545 20.2652 6.00009 20 6.00009ZM10 5.00009C10 4.73487 10.1054 4.48052 10.2929 4.29298C10.4804 4.10545 10.7348 4.00009 11 4.00009H13C13.2652 4.00009 13.5196 4.10545 13.7071 4.29298C13.8946 4.48052 14 4.73487 14 5.00009V6.00009H10V5.00009ZM17 19.0001C17 19.2653 16.8946 19.5197 16.7071 19.7072C16.5196 19.8947 16.2652 20.0001 16 20.0001H8C7.73478 20.0001 7.48043 19.8947 7.29289 19.7072C7.10536 19.5197 7 19.2653 7 19.0001V8.00009H17V19.0001ZM14 18.0001C14.2652 18.0001 14.5196 17.8947 14.7071 17.7072C14.8946 17.5197 15 17.2653 15 17.0001V11.0001C15 10.7349 14.8946 10.4805 14.7071 10.293C14.5196 10.1054 14.2652 10.0001 14 10.0001C13.7348 10.0001 13.4804 10.1054 13.2929 10.293C13.1054 10.4805 13 10.7349 13 11.0001V17.0001C13 17.2653 13.1054 17.5197 13.2929 17.7072C13.4804 17.8947 13.7348 18.0001 14 18.0001Z"
            fill={props.color || "#CF0327"}
        />
    </Svg>
);

export default DeleteIcon;
