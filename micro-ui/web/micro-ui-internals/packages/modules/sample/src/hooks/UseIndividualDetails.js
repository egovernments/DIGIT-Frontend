// import { useQuery } from "react-query";

// const UseIndividualDetails = (id) => {
//   const { isLoading, error, data, isFetching } = useQuery(
//     ["individual", id],
//     async () => {
//       const response = await CustomService.getResponse({
//         url: `/individual/v1/_search`,
//         changeQueryName: id,
//         params: {
//           tenantId: "pg.citya",
//           offset: 0,
//           limit: 100,
//         },
//         body: {
//           Individual: {
//             tenantId: "pg.citya",
//             individualId: id,
//           },
//         },
//       });
//       return response.data; 
//       console.log("response data",response.data);
//     },
//     {
//       cacheTime: 0,
//     }
//   );

//   return { isLoading, data, isFetching, error };
// };

// export default UseIndividualDetails;
