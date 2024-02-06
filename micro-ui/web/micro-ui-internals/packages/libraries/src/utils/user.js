//This Utility will return the user details
export const getLoggedInUserDetails = (type) => {
    const userInfos = Digit.UserService.getUser();
    switch(type) {
        case "username" : {
            return userInfos;
        }
        case "roles" : {
            return userInfos?.info?.roles?.map((e) => e.code);
        }
        default : {
            return userInfos;
        }
    }
}