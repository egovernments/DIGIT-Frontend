import React from 'react';
import { Banner } from '@egovernments/digit-ui-react-components';
import { useLocation } from 'react-router-dom';

const SchemaResponsePage = () => {
    const location = useLocation(); // Use the useLocation hook to access the location object
    const { state } = location;

    return (
        <div className="schema-response-page">
            <Banner
                successful={state?.result?.ResponseInfo?.status === 'successful'}
                message={state?.result?.ResponseInfo?.status === 'successful' ? 'Schema Created Successfully' : 'Error Creating Schema'}
                schemaCode={state && state.result && state.result.SchemaDefinitions && state.result.SchemaDefinitions[0] ? state.result.SchemaDefinitions[0].code : null}
            />
        </div>
    );
};

export default SchemaResponsePage;
