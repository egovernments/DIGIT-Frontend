import React from 'react'
import HeaderComp from './HeaderComp';
import { Card } from '@egovernments/digit-ui-components';
import { Chip } from '@egovernments/digit-ui-components';

const SubBoundaryView = ({ title, arr }) => {
    // console.log("hi", "subBoundaryView", title, arr);
    return (
        <div>
            {
            arr && arr.length>0 ?(
            <Card>
                <HeaderComp title={title} />
                {/* Flex container for the chips */}
                <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "2px" }}>
                    {arr.map((el, ind) => {
                        return (
                            <div key={ind} className="digit-tag-container" style={{ minWidth: "1rem" }} >
                                <Chip
                                    className=""
                                    error=""
                                    extraStyles={{
                                        color: 'red',
                                        display: "inline-block", // Ensures Chip behaves inline within its container
                                    }}
                                    onClick={() => { }}
                                    onTagClick={() => { }}
                                    text={el} // Text from arr
                                />
                            </div>
                        );
                    })}
                </div>
            </Card>
            ): (
                null
            )
        }

        </div>

    );

}

export default SubBoundaryView