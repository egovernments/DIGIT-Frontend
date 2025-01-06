// import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// const BoundaryComponent = ({initialValue, updateSeeeionStorage, selectedProject, onChange, lowestLevel }) => {
//   //const kk = ["COUNTRY", "PROVINCE", "DISTRICT", "ADMINISTRATIVEPOST", "LOCALITY", "VILLAGE"];

//   const kk = Digit.SessionStorage.get("boundaryHierarchyOrder").map((item) => item.code);

//   console.log("selectedProject",selectedProject)

//   debugger

//   const { t } = useTranslation();
//   const tenantId = Digit.ULBService.getCurrentTenantId();

//   const defaultBoundaryData = kk.reduce((acc, curr) => {
//     acc[curr] = false;
//     return acc;
//   }, {});

//   const defaultSelectData = kk.reduce((acc, curr) => {
//     acc[curr] = null;
//     return acc;
//   }, {});

//   const [boundaryData, setBoundaryData] = useState(defaultBoundaryData);
//   const [value, setValue] = useState(
//     kk.reduce((acc, curr) => {
//       acc[curr] = [];
//       return acc;
//     }, {})
//   );

//   console.log(boundaryData, 'bbbbbbbbbbbbbbbbbbbbb');

//   const [selectedValues, setSelectedValues] = useState(defaultSelectData);

//   useEffect(() => {
//     // const storedValues = sessionStorage.getItem("selectedValues");
//     if (initialValue) {
//       setSelectedValues(JSON.parse(initialValue));
//     }
//   }, []);

//   // useEffect(() => {
//   //   sessionStorage.setItem("selectedValues", JSON.stringify(selectedValues));
//   // }, [selectedValues]);

//   const reqCriteriaResource = {
//     url: `/boundary-service/boundary-relationships/_search`,
//     params: {
//       tenantId: tenantId,
//       hierarchyType: selectedProject?.address?.boundary.split("_")[0],
//       includeChildren: true,
//       codes: selectedProject?.address?.boundary,
//       boundaryType: selectedProject?.address?.boundaryType,
//     },
//     config: {
//       enabled: true,
//       select: (data) => data,
//     },
//   };

//   const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

//   const handleButtonClick = (value) => {
//     onChange(value);
//     handleDropdownOptions(value);
//   };

//   useEffect(()=>{

//   },[value])

//   useEffect(() => {
//     // if (lowestLevel) {
//     //   // Reset selected values and boundary data
//     //   setSelectedValues(defaultSelectData);
//     //   setValue(
//     //     kk.reduce((acc, curr) => {
//     //       acc[curr] = [];
//     //       return acc;
//     //     }, {})
//     //   );
//     //   setBoundaryData(defaultBoundaryData);

//     //   if (updateSeeeionStorage) {
//     //     updateSeeeionStorage(defaultSelectData); // Update session storage
//     //   }
//     // }
//   }, [lowestLevel]);

//   const createFormattedData = (activeBoundary) => {
//     const index = kk.indexOf(activeBoundary);
//     return kk.reduce((acc, key, i) => {
//       acc[key] = i >= index;
//       return acc;
//     }, {});
//   };

//   useEffect(() => {
//     if (childrenData && childrenData.length > 0) {
//       setValue((prevState) => ({
//         ...prevState,
//         [childrenData[0]?.boundary[0].boundaryType]: [childrenData[0]?.boundary[0]],
//       }));

//       const formattedData = createFormattedData(childrenData[0]?.boundary[0].boundaryType);
//       setBoundaryData(formattedData);
//     }
//   }, [childrenData]);

//   const handleDropdownOptions = (value) => {
//     if (value?.children && value.children.length > 0) {
//       const updatedState = value.children.reduce((acc, child) => {
//         const boundaryType = child?.boundaryType;
//         if (boundaryType) {
//           acc[boundaryType] = [...(acc[boundaryType] || []), child];
//         }
//         return acc;
//       }, {});

//       setValue((prevState) => ({
//         ...prevState,
//         ...updatedState,
//       }));

//       setSelectedValues((prev) => {
//         const newSelectedValues = { ...prev, [value?.boundaryType]: value };
//         //sessionStorage.setItem("selectedValues", JSON.stringify(newSelectedValues));
//         if(updateSeeeionStorage){
//         updateSeeeionStorage(newSelectedValues)
//         }
//         return newSelectedValues;
//       });
//     }
//   };

//   // Handle insertion of new boundary
//   const handleInsertion = (boundaryType, newValue) => {
//     setValue((prevState) => {
//       const newState = { ...prevState };
//       const currentBoundary = newState[boundaryType] || [];
//       if (!currentBoundary.find((item) => item === newValue)) {
//         newState[boundaryType] = [...currentBoundary, newValue];
//       }
//       return newState;
//     });

//     // Reset selected values for child boundaries if necessary
//     resetChildrenSelectedValues(boundaryType);
//   };

//   // Handle deletion of boundary
//   const handleDeletion = (boundaryType, valueToRemove) => {
//     setValue((prevState) => {
//       const newState = { ...prevState };
//       newState[boundaryType] = newState[boundaryType]?.filter((item) => item !== valueToRemove) || [];
//       return newState;
//     });

//     // Reset selected values for child boundaries if necessary
//     resetChildrenSelectedValues(boundaryType);
//   };

//   // Reset selected values for child boundaries
//   const resetChildrenSelectedValues = (boundaryType) => {
//     const index = kk.indexOf(boundaryType);
//     const newSelectedValues = { ...selectedValues };

//     // Reset all child dropdowns based on the boundary type
//     for (let i = index + 1; i < kk.length; i++) {
//       newSelectedValues[kk[i]] = null;
//     }

//     setSelectedValues(newSelectedValues);
//   };

//   const isBoundaryAllowed = (boundaryType) => {
//     if (!lowestLevel) {
//       // If lowestLevel is null or undefined, include all boundaries
//       return true;
//     }

//     const boundaryIndex = kk.indexOf(boundaryType);
//     const lowestLevelIndex = kk.indexOf(lowestLevel);

//     return boundaryIndex <= lowestLevelIndex; // Include only up to the lowestLevel
//   };

//   return (
//     <React.Fragment>
//       <div>
//         {kk.map((key) => {
//           if (boundaryData[key] && isBoundaryAllowed(key)) {
//             console.log(key, 'kkkkkkkkkkkkkk');
//             return (
//               <BoundaryDropdown
//                 key={key}
//                 label={`ATTENDANCE_${key}`}
//                 data={value[key]}
//                 onChange={(selectedValue) => handleButtonClick(selectedValue)}
//                 selected={selectedValues[key]}
//                 setSelected={(newValue) => {
//                   setSelectedValues((prev) => ({
//                     ...prev,
//                     [key]: newValue,
//                   }));
//                   // You can call handleInsertion or handleDeletion based on your logic
//                   if (newValue) {
//                     handleInsertion(key, newValue); // Add the selected value
//                   } else {
//                     handleDeletion(key, selectedValues[key]); // Remove the previously selected value
//                   }
//                 }}
//               />
//             );
//           }
//           return null;
//         })}
//       </div>
//     </React.Fragment>
//   );
// };

// const BoundaryDropdown = ({ label, data, onChange, selected, setSelected }) => {
//   const { t } = useTranslation();

//   return (
//     <div style={{ width: "100%", marginTop: "14px" }}>
//       <TextBlock body={t(label)} />
//       <Dropdown
//         selected={selected}
//         t={t}
//         option={data}
//         optionKey={"code"}
//         select={(value) => {
//           setSelected(value);
//           onChange(value);
//         }}
//       />
//     </div>
//   );
// };

// export default BoundaryComponent;

import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScreenTypeEnum } from "../utils/constants";

const BoundaryComponent = ({ initialValue, updateSeeeionStorage, selectedProject, onChange, lowestLevel, isRequired }) => {
  const kk = Digit.SessionStorage.get("boundaryHierarchyOrder").map((item) => item.code);

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const defaultBoundaryData = kk.reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});

  const defaultSelectData = kk.reduce((acc, curr) => {
    acc[curr] = null;
    return acc;
  }, {});

  const [boundaryData, setBoundaryData] = useState(defaultBoundaryData);
  const [value, setValue] = useState(
    kk.reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {})
  );

  const [selectedValues, setSelectedValues] = useState(defaultSelectData);

  const [lowest, setLowest] = useState(lowestLevel);

  useEffect(() => {
    if (initialValue) {
      setSelectedValues(JSON.parse(initialValue));
    }
  }, []);

  const reqCriteriaResource = {
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId: tenantId,
      hierarchyType: selectedProject?.address?.boundary.split("_")[0],
      includeChildren: true,
      codes: selectedProject?.address?.boundary,
      boundaryType: selectedProject?.address?.boundaryType,
    },
    config: {
      enabled: true,
      select: (data) => data,
    },
  };

  const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

  useEffect(() => {
    if (selectedProject) {
      setSelectedValues(defaultSelectData);
      setValue(
        kk.reduce((acc, curr) => {
          acc[curr] = [];
          return acc;
        }, {})
      );
      setBoundaryData(defaultBoundaryData);

      if (updateSeeeionStorage) {
        updateSeeeionStorage(defaultSelectData);
      }
    }
  }, [selectedProject]);

  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      setValue((prevState) => ({
        ...prevState,
        [childrenData[0]?.boundary[0].boundaryType]: [childrenData[0]?.boundary[0]],
      }));

      const formattedData = createFormattedData(childrenData[0]?.boundary[0].boundaryType);
      setBoundaryData(formattedData);
    }
  }, [childrenData]);

  // Reset only dropdowns below the lowest level
  useEffect(() => {
    setSelectedValues(defaultSelectData);
    onChange(null);
  }, [lowest, lowestLevel]);

  const createFormattedData = (activeBoundary) => {
    const index = kk.indexOf(activeBoundary);
    return kk.reduce((acc, key, i) => {
      acc[key] = i >= index;
      return acc;
    }, {});
  };

  const handleButtonClick = (value) => {
    onChange(value);
    handleDropdownOptions(value);
  };
  const handleDropdownOptions = (value) => {
    if (value?.children && value.children.length > 0) {
      const updatedState = value.children.reduce((acc, child) => {
        const boundaryType = child?.boundaryType;
        if (boundaryType) {
          acc[boundaryType] = [...(acc[boundaryType] || []), child];
        }
        return acc;
      }, {});

      setValue((prevState) => ({
        ...prevState,
        ...updatedState,
      }));

      setSelectedValues((prev) => {
        const newSelectedValues = { ...prev, [value?.boundaryType]: value };
        if (updateSeeeionStorage) {
          updateSeeeionStorage(newSelectedValues);
        }
        return newSelectedValues;
      });
    }
  };

  const handleInsertion = (boundaryType, newValue) => {
    setValue((prevState) => {
      const newState = { ...prevState };
      const currentBoundary = newState[boundaryType] || [];
      if (!currentBoundary.find((item) => item === newValue)) {
        newState[boundaryType] = [...currentBoundary, newValue];
      }
      return newState;
    });

    resetChildrenSelectedValues(boundaryType);
  };

  const handleDeletion = (boundaryType, valueToRemove) => {
    setValue((prevState) => {
      const newState = { ...prevState };
      newState[boundaryType] = newState[boundaryType]?.filter((item) => item !== valueToRemove) || [];
      return newState;
    });

    resetChildrenSelectedValues(boundaryType);
  };

  const resetChildrenSelectedValues = (boundaryType) => {
    const index = kk.indexOf(boundaryType);
    const newSelectedValues = { ...selectedValues };

    for (let i = index + 1; i < kk.length; i++) {
      newSelectedValues[kk[i]] = null;
    }

    setSelectedValues(newSelectedValues);
  };

  const isBoundaryAllowed = (boundaryType) => {
    if (!lowestLevel) {
      return true;
    }

    const boundaryIndex = kk.indexOf(boundaryType);
    const lowestLevelIndex = kk.indexOf(lowestLevel);

    return boundaryIndex <= lowestLevelIndex;
  };

  return (
    <React.Fragment>
      <div>
        {kk.map((key) => {
          if (boundaryData[key] && isBoundaryAllowed(key)) {
            return (
              <BoundaryDropdown
                isRequired={isRequired == ScreenTypeEnum.BILL ? true : key == "DISTRICT" ? true : false}
                key={key}
                label={`ATTENDANCE_${key}`}
                data={value[key]}
                onChange={(selectedValue) => handleButtonClick(selectedValue)}
                selected={selectedValues[key]}
                setSelected={(newValue) => {
                  setSelectedValues((prev) => ({
                    ...prev,
                    [key]: newValue,
                  }));
                  if (newValue) {
                    handleInsertion(key, newValue);
                  } else {
                    handleDeletion(key, selectedValues[key]);
                  }
                }}
              />
            );
          }
          return null;
        })}
      </div>
    </React.Fragment>
  );
};

const BoundaryDropdown = ({ label, data, onChange, selected, setSelected, isRequired }) => {
  const { t } = useTranslation();
  debugger;
  return (
    <div style={{ width: "100%", marginTop: "14px" }}>
      <TextBlock body={isRequired == true ? `${t(label)}*` : t(label)} />
      <Dropdown
        selected={selected}
        t={t}
        option={data}
        optionKey={"code"}
        select={(value) => {
          setSelected(value);
          onChange(value);
        }}
      />
    </div>
  );
};

export default BoundaryComponent;
