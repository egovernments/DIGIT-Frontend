


export const getUserType=()=>{
    return window?.Digit?.SessionStorage?.get("userType")||"employee";
}