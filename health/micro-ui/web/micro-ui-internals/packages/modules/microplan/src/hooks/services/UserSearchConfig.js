
//returns obj that maps uuid to userName 
const UserSearchConfig = async (body) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/user/_search",
        useCache: false,
        method: "POST",
        userService: false,
        body,
      });
      if (response?.user?.length === 0) {
        throw new Error("No users found with the given uuid");
      }
      let userNames={}
      for (const ob of response.user){
        userNames[user?.uuid]=user.userName;
      }
      return userNames;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  };
  
  export default UserSearchConfig;
  