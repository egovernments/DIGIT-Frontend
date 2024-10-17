import React from 'react'
import HeaderComp from './HeaderComp';
import { Card } from '@egovernments/digit-ui-components';
import { Chip } from '@egovernments/digit-ui-components';

const SubBoundaryView = ({ title, arr }) => {
    return (
        <div>
            {
                arr && arr.length > 0 ? (
                    <Card>
                        <HeaderComp title={title} />
                        {/* Flex container for the chips */}
                        <div className="subBoundarycomp-container">
                            {arr.map((el, ind) => {
                                return (
                                    <div className="digit-tag-container">
                                        <Chip
                                            className=""
                                            error=""
                                            extraStyles={{}}
                                            iconReq=""
                                            onClick={function noRefCheck() { }}
                                            onTagClick={function noRefCheck() { }}
                                            text={el}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ) : (
                    null
                )
            }

        </div>

    );

}

export default SubBoundaryView