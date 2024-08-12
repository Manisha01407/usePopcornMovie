import { useState } from "react";
import PropType from "prop-types";

const ContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
};

const StarContainerStyle = {
    display: "flex",
};

StarRating.propTypes = {
    maxrating: PropType.number.isRequired,
    defaultrating: PropType.number,
    color: PropType.string,
    size: PropType.number,
    message: PropType.array,
    onsetmovie: PropType.func,

};


export default function StarRating({ maxrating = 8, color = "#fcc419", size = 49, message = [], defaultrating = 0, onsetrating }) {
    const [rating, setRating] = useState(defaultrating);
    const [temprating, settemprating] = useState(0);

    const textStyle = {
        lineHeight: "1",
        margin: "0",
        color,
        fontSize: `${size / 1.5}px`,
    }

    function Handilerate(rating) {
        setRating(rating);
        onsetrating(rating);
    }

    return (
        <div style={ContainerStyle}>
            <div style={StarContainerStyle}>
                {
                    Array.from({ length: maxrating }, (_, i) => (<Star key={i} onRate={() => Handilerate(i + 1)} full={temprating ? temprating >= i + 1 : rating >= i + 1} onHoverIn={() => settemprating(i + 1)} onHoverOut={() => settemprating(0)} color={color} size={size} />))
                }
            </div>
            <p style={textStyle}>{message.length === maxrating ? message[temprating ? temprating - 1 : rating - 1] : temprating || rating || ""}</p>
        </div>
    );
}


function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {

    const styleStar = {
        height: `${size}px`,
        width: `${size}px`,
        display: "box",
        cursor: "pointer",
    }


    return (
        < span style={styleStar} onClick={onRate} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} >
            {
                full ?
                    < svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill={color}
                        stroke={color}
                    >
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                    </svg >
                    : <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={color}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="{2}"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
            }
        </span >
    );
}