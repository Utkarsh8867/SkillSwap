
/**
 * @param {...(string|boolean|null|undefined)} classes -
 * @returns {string} The joined class names.
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * @param {string} str
 * @param {number} num
 */
export const truncateText = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

/**
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function} 
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * @param {number} bytes
 * @param {number} decimals 
 * @returns {string} 
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};