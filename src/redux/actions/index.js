// Coloque aqui suas actions
export const SAVE_USEREMAIL = 'SAVE_EMAIL';
export const GET_CURRENCIES = 'GET_CURRENCIES';

export const saveUserEmail = (email) => ({ type: SAVE_USEREMAIL, email });

export const getCurrencies = (currencies) => ({ type: GET_CURRENCIES, currencies });

export const fetchCurrenciesAPI = () => (dispatch) => fetch('https://economia.awesomeapi.com.br/json/all').then((response) => response.json()).then((json) => {
  const data = Object.keys(json).filter((key) => key !== 'USDT');
  dispatch(getCurrencies(data));
});
