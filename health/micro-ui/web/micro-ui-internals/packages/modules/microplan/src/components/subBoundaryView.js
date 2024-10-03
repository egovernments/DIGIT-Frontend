import React from 'react'
import HeaderComp from './HeaderComp';
import { Card } from '@egovernments/digit-ui-components';
import { Chip } from '@egovernments/digit-ui-components';

const SubBoundaryView = ({ title, arr }) => {
    return (
        <div>
            {
            arr && arr.length>0 ?(
            <Card>
                <HeaderComp title={title} />
                {/* Flex container for the chips */}
                <div className="subBoundarycomp-container">
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