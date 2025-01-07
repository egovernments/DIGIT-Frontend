const searchAttendanceWithUserDetails = async ({ tenantId, limit, offset }) => {
    try {
  
      // First API call to get attendance register
      const registerResponse = await Digit.CustomService.getResponse({
        url: "/health-attendance/v1/_search",
        method: "POST",
        params: { tenantId, limit, offset },
        body: {
          attendanceRegister: {
            tenantId,
          },
        },
      });
  
      if (!registerResponse?.attendanceRegister?.length) {
        return { 
          registers: [], 
          staffAttendeeMap: {}, 
          attendeeDetailsMap: {},
          userDetails: [],
          isError: false 
        };
      }
  
      // Create maps and collect IDs
      const staffAttendeeMap = {};
      const individualIds = new Set();
      const staffUserIds = new Set();
  
      // Populate maps and collect IDs
      registerResponse.attendanceRegister.forEach((register) => {
        const staffMember = register.staff?.[0];
        if (staffMember?.userId) {
          // Collect staff user IDs
          staffUserIds.add(staffMember.userId);
          
          // Map staff ID to their attendees
          staffAttendeeMap[staffMember.userId] = register.attendees || [];
          
          // Collect all individual IDs from attendees
          register.attendees?.forEach(attendee => {
            if (attendee.individualId) {
              individualIds.add(attendee.individualId);
            }
          });
        }
      });
  
      // If no IDs found, return early
      if (individualIds.size === 0 && staffUserIds.size === 0) {
        return {
          registers: registerResponse.attendanceRegister,
          staffAttendeeMap,
          attendeeDetailsMap: {},
          userDetails: [],
          isError: false
        };
      }
  
      // Get staff user details
      const staffResponse = await Digit.CustomService.getResponse({
        url: "/health-individual/v1/_search",
        method: "POST",
        params: {
          limit: 1000,
          offset: 0,
          tenantId,
        },
        body: {
          Individual: {
            id: Array.from(staffUserIds)
          },
        },
      });

  
      // Get attendee details
      const individualResponse = await Digit.CustomService.getResponse({
        url: "/health-individual/v1/_search",
        method: "POST",
        params: {
          limit: 1000,
          offset: 0,
          tenantId,
        },
        body: {
          Individual: {
            id: Array.from(individualIds)
          },
        },
      });
  
      // Create map of staff details
      const userDetails = staffResponse?.Individual.map(user => {
        // Find the register that contains this staff member
        const registerWithStaff = registerResponse.attendanceRegister.find(
          register => register.staff?.[0]?.userId === user.id
        );
        
        return {
          id: user.id,
          name: user?.name?.givenName,
          dob: user.dateOfBirth,
          email: user?.email,
          mobileNumber: user?.mobileNumber,
          registerId: registerWithStaff?.staff?.[0]?.registerId || null  // Add registerId here
        };
      });
  
      // Create map of individual details
      const attendeeDetailsMap = {};
      individualResponse?.Individual.forEach(individual => {
        attendeeDetailsMap[individual.id] = {
          name: individual?.name?.givenName,
          dob: individual.dateOfBirth,
          email: individual?.email,
          mobileNumber: individual?.mobileNumber,
        };
      });
  
      // Create a map for quick lookup of staff details
      const staffDetailsMap = {};
      userDetails.forEach(user => {
        staffDetailsMap[user.id] = user;
      });
  
      // Enhance staffAttendeeMap with both staff and individual details
      Object.keys(staffAttendeeMap).forEach(staffId => {
        const enhancedStaffData = {
          staffDetails: staffDetailsMap[staffId] || null,
          attendees: staffAttendeeMap[staffId].map(attendee => ({
            ...attendee,
            individualDetails: attendeeDetailsMap[attendee.individualId] || null
          }))
        };
        staffAttendeeMap[staffId] = enhancedStaffData;
      });
  
      return {
        registers: registerResponse.attendanceRegister,
        staffAttendeeMap,
        attendeeDetailsMap,
        userDetails,
        isError: false,
      };
  
    } catch (error) {
      console.error("Error in searchAttendanceWithUserDetails:", error);
      return {
        registers: [],
        staffAttendeeMap: {},
        attendeeDetailsMap: {},
        userDetails: [],
        isError: true,
        error: error.message || "An unknown error occurred",
      };
    }
  };
  
  export default searchAttendanceWithUserDetails;
