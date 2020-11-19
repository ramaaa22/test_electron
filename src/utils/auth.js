//import Cookies from 'js-cookie'

const token_key = 'fna_'

function getTokenKey(api) {
  return `${token_key}_${api}`
}

export function getToken(api) {
  return localStorage.getItem(getTokenKey(api));
}

export function setToken(api, token) {
  localStorage.setItem(getTokenKey(api), token);
}

export function removeToken(api) {
  localStorage.removeItem(getTokenKey(api));
}
