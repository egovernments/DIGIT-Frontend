import React from "react";

const ProgressBar = ({ bgcolor, total, completed }) => {

    const progress = (completed / total) * 100;

    const fillerStyle = {
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        width: `${progress}%`,
        height: "100%",

    }

    const textStyle = {
        whiteSpace: "nowrap",
        color: bgcolor,
        textAlign: "center",
        maxWidth: "auto",
        marginLeft: "16px"

    }


    return (
        <div className="parentDiv-progress" >
            <div className="containerDiv-progress">
                <div style={fillerStyle}></div>
            </div>
            <div style={textStyle}>{completed}/{total} days
            </div>
        </div>

    );
};

export default ProgressBar;