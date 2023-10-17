const selectNextState = (state) => {
    if (state === "zero") return "half";
    else if (state === "half") return "full";
    else if (state === "full") return "zero";
  };
  
  const updateAttendenceCount = (state) => {
    let currentAttendence = { Sun: 0, Sat: 0, Fri: 0, Thu: 0, Wed: 0, Tue: 0, Mon: 0 }
    for (let day of Object.keys(currentAttendence)) {
      for (let row of Object.keys(state)) {
        let attendence = state[row].attendence[day];
        if (attendence === "half") {
          currentAttendence[day] += 0.5;
        } else if (attendence === "full") {
          currentAttendence[day] += 1;
        }
      }
    }
    return currentAttendence;
  };
  
  const updateAmtAndWorkingDays = (state) => {
    let totalAmount = 0
    let totalActualWorkingDays = 0
    for (let row of Object.keys(state)) {
      if(row !== 'total') {
        totalAmount += state[row].amount
        totalActualWorkingDays += state[row].actualWorkingDays
      }    
    }
    return {totalAmount, totalActualWorkingDays};
  };
  
  const updateModifiedAmtAndWorkingDays = (state) => {
    let totalModifiedAmount = 0
    let totalModifiedActualWorkingDays = 0
    for (let row of Object.keys(state)) {
      if(row !== 'total') {
        totalModifiedAmount += state[row].modifiedAmount
        totalModifiedActualWorkingDays += state[row].modifiedWorkingDays
      }    
    }
    return {totalModifiedAmount, totalModifiedActualWorkingDays};
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case "attendanceTotal":
        const prevAttendence = action.state.row.attendence;
        prevAttendence[action.state.day] = selectNextState(action.state.row.attendence[action.state.day]);
        const obj = {
          [action.state.row.id]: {
            ...action.state.row,
            attendence: prevAttendence,
          },
        };
        let updatedState = { ...state, ...obj };;
        let attendanceTotalCount = updateAttendenceCount(updatedState);
        return { ...state, total: { ...state.total, attendence: attendanceTotalCount }  };
      
      case "initialTotal":
        const initialTotalCount = updateAttendenceCount(state);
        const { totalAmount, totalActualWorkingDays } = updateAmtAndWorkingDays(state)
        const { totalModifiedAmount, totalModifiedActualWorkingDays } = updateModifiedAmtAndWorkingDays(state)
        return { ...state, total: { ...state.total, attendence: initialTotalCount, amount: totalAmount, actualWorkingDays: totalActualWorkingDays, modifiedAmount: totalModifiedAmount, modifiedWorkingDays: totalModifiedActualWorkingDays}  };
  
      case "updateModifiedTotal":
        const skillAmount = parseFloat(action.state.row.amount / action.state.row.actualWorkingDays)
        const newObj = {
          [action.state.row.id]: {
            ...action.state.row,
            modifiedAmount: skillAmount * parseFloat(action.state.val),
            modifiedWorkingDays: parseFloat(action.state.val),
          }
        }
        let newState = { ...state, ...newObj };;
        const { totalModifiedAmount: amount, totalModifiedActualWorkingDays: workingDays } = updateModifiedAmtAndWorkingDays(newState)
        return { ...newState, total: { ...newState.total, modifiedAmount: amount, modifiedWorkingDays: workingDays}  };
      default:
        return state;
    }
  };
  
  export default reducer;