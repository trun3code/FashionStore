export const formatPrice = (price, sale = 0) => {
  const priceString = Math.round(price * (100 - sale) / 100);
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return formatter.format(priceString)
}

export const formatDate = (dateString) => {
  if (dateString == null) return "-";
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  return formattedDate
}
export const calculateDistance = (trip) => {
  if(trip && trip.trips[0] && trip.trips[0].legs && trip.trips[0].distance) {
     const legs = trip?.trips[0]?.legs
     const allDistance = trip?.trips[0]?.distance
     return ((allDistance - legs[legs?.length-1]?.distance)/1000).toFixed(2)
  }
  return 0
 }
 
 export const calculateDuration = (trip) => {
     if(trip && trip.trips[0] && trip.trips[0].legs && trip.trips[0].distance) {
         const legs = trip?.trips[0]?.legs
         const allDuration= trip?.trips[0]?.duration
         return ((allDuration- legs[legs?.length-1]?.duration)/60).toFixed(0)
     }
     return 0
 }
 