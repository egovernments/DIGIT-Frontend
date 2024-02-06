import debounce from 'lodash/debounce';

export const debouncing = (func, delay) => {
    return debounce(func,delay);
}