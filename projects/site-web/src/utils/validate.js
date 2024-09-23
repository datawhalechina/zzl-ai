/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */

export function validPhone(str) {
  var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(str.trim())) {
      return false;
  } else {
      return true;
  }
}
export function validPassword(str) {
  var myreg=/(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/;
  if (myreg.test(str.trim())) {
    return true;
  } else {
    return false;
  }
}
