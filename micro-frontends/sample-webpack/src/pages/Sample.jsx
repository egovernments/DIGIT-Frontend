import { Suspense } from "react";
import JsonSchemaForm from "../hoc/FormComposer";
import { sampleConfig } from "../configs/sampleConfig";

function Sample() {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <h1 className="text-2xl text-center font-bold mt-5">Loading...</h1>
          }
        >
          <JsonSchemaForm schema={sampleConfig?.schema} uiSchema={sampleConfig?.uiSchema} />
        </Suspense>
      </div>
    </>
  );
}

export default Sample;


