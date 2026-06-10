export const getTitleHeading = (sentence) => {
  var splitStr = sentence?.toLowerCase().split(' ');
   for (var i = 0; i < splitStr?.length; i++) {
       splitStr[i] = splitStr[i].charAt(0)?.toUpperCase() + splitStr[i]?.substring(1);     
   }
   return sentence?.trim()?.length === 0 ? '' : splitStr?.join(' '); 
}