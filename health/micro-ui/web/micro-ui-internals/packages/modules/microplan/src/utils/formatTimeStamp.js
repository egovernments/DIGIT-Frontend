function formatTimestamp(timestamp) {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Get the day of the month and suffix
    const day = date.getDate();
    const suffix = getDaySuffix(day);

    // Get the month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];

    // Get the hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading zero
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    const year = date.getFullYear();

    // Construct the final string
    return `${day}${suffix} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}

// Helper function to get the appropriate day suffix (st, nd, rd, th)
function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th'; // 11th to 20th always end in 'th'
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Example usage:

export default formatTimestamp;

