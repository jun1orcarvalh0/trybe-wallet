// Coloque aqui suas actions
export const SAVE_USEREMAIL = 'SAVE_EMAIL';
export const GET_CURRENCIES = 'GET_CURRENCIES';
export const SAVE_USEREXPENSE = 'SAVE_USEREXPENSES';
export const REMOVE_USEREXPENSE = 'REMOVE_USEREXPENSE';

export const saveUserEmail = (email) => ({ type: SAVE_USEREMAIL, email });

export const getCurrencies = (currencies) => ({ type: GET_CURRENCIES, currencies });

export const saveUserExpense = (userExpense) => ({ type: SAVE_USEREXPENSE, userExpense });

export const removeUserExpense = (userExpenseRemoved) => (
  { type: REMOVE_USEREXPENSE, userExpenseRemoved });

export function fetchCurrenciesAPI() {
  return async (dispatch) => {
    const request = await fetch('https://economia.awesomeapi.com.br/json/all');
    const response = await request.json();
    const data = Object.keys(response).filter((key) => key !== 'USDT');
    dispatch(getCurrencies(data));
  };
}

export async function fetchExchangeRates() {
  const request = await fetch('https://economia.awesomeapi.com.br/json/all');
  const response = await request.json();
  delete response.USDT;
  return response;
}
