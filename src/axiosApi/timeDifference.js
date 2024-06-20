function TimeAgo(date) {

    const now = new Date();
    const givenDate = new Date(date);
    const diffInSeconds = Math.floor((now - givenDate) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInWeek = 7 * secondsInDay;
    const secondsInMonth = 30 * secondsInDay; // Approximation
    const secondsInYear = 365 * secondsInDay; // Approximation

    if (diffInSeconds < secondsInMinute) {
        return `조금 전`;
    } else if (diffInSeconds < secondsInHour) {
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes}분 전`;
    } else if (diffInSeconds < secondsInDay) {
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours}시간 전`;
    } else if (diffInSeconds < secondsInWeek) {
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days}일 전`;
    } else if (diffInSeconds < secondsInMonth) {
        const weeks = Math.floor(diffInSeconds / secondsInWeek);
        return `${weeks}주 전`;
    } else if (diffInSeconds < secondsInYear) {
        const months = Math.floor(diffInSeconds / secondsInMonth);
        return `${months}개월 전`;
    } else {
        const years = Math.floor(diffInSeconds / secondsInYear);
        return `${years}년 전`;
    }
}

export default TimeAgo;