import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWith';
import mockData from './helpers/mockData';

delete mockData.USDT;

describe('Tests in React-Redux', () => {
  const pathLogin = '/';
  const pathWallet = '/carteira';

  const emailTest = 'juniorcarvalho@trybe.com';
  const passwordTest = 'trybe1234';

  const wrongEmailTest = 'juniorcarvalho';
  const wrongPasswordTest = 'trybe';

  const CURRENCY_ARRAY = [
    'USD',
    'CAD',
    'GBP',
    'ARS',
    'BTC',
    'LTC',
    'EUR',
    'JPY',
    'CHF',
    'AUD',
    'CNY',
    'ILS',
    'ETH',
    'XRP',
    'DOGE',
  ];

  const INPUT_TESTID = 'value-input';
  const DESCRIPTION_TESTID = 'description-input';

  const foodCategory = 'Alimentação';

  const INITIAL_STATE = {
    user: {
      email: emailTest,
    },
    wallet: {
      currencies: CURRENCY_ARRAY,
      expenses: [],
      editor: false,
      idToEdit: 0,
      isFetching: false,
    },
  };

  const value = '30';
  const paymentMethod = 'Cartão de débito';
  const category = foodCategory;
  const description = 'McDonalds';

  const editExpense = 'Editar Despesa';

  describe('Test the login page', () => {
    it('Test rendering and initial values', () => {
      renderWithRouterAndRedux(<App />, { initialEntries: [pathLogin] });

      const inputEmail = screen.getByTestId(/email/i);
      const inputPassword = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      expect(inputEmail).toBeInTheDocument();
      expect(inputPassword).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      expect(inputEmail).toHaveValue('');
      expect(inputPassword).toHaveValue('');
    });
    it('Test correct submit values and push to Wallet page', () => {
      const { history, store } = renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathLogin] },
      );

      const inputEmail = screen.getByLabelText(/email/i);
      const inputPassword = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      userEvent.type(inputEmail, emailTest);
      userEvent.type(inputPassword, passwordTest);

      expect(inputEmail).toHaveValue(emailTest);
      expect(inputPassword).toHaveValue(passwordTest);

      userEvent.click(submitButton);

      expect(history.location.pathname).toBe(pathWallet);

      expect(store.getState()).toEqual(
        {
          user: { email: emailTest },
          wallet: { currencies: [], expenses: [], editor: false, idToEdit: 0 },
        },
      );
    });
    it('Test submit button is disable when inputs are not correct', () => {
      renderWithRouterAndRedux(<App />, { initialEntries: [pathLogin] });

      const inputEmail = screen.getByLabelText(/email/i);
      const inputPassword = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      userEvent.type(inputEmail, wrongEmailTest);
      userEvent.type(inputPassword, wrongPasswordTest);

      expect(submitButton).toBeDisabled();
    });
  });
  describe('Test the wallet page', () => {
    it('Test the path of the page', () => {
      const { history } = renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet] },
      );
      expect(history.location.pathname).toBe(pathWallet);
    });
    it('Test rendering Header and initial values', () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet], initialState: { user: { email: emailTest } } },
      );
      const userEmail = screen.getByRole('heading', { name: emailTest, level: 3 });
      const userTotalExpenses = screen.getByRole('heading', { name: '0.00', level: 4 });
      const headerCurrencyField = screen.getByRole('heading', { name: 'BRL', level: 4 });

      expect(userEmail).toBeInTheDocument();
      expect(userTotalExpenses).toBeInTheDocument();
      expect(headerCurrencyField).toBeInTheDocument();
    });
    it('Test rendering WalletForm', () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet] },
      );

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const selectCurrency = screen.getByTestId('currency-input');
      const selectPayment = screen.getByTestId('method-input');
      const selectTag = screen.getByTestId('tag-input');
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });

      expect(inputValue).toBeInTheDocument();
      expect(selectCurrency).toBeInTheDocument();
      expect(selectPayment).toBeInTheDocument();
      expect(selectTag).toBeInTheDocument();
      expect(inputDescription).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
    it('Test submit values', () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet], initialState: INITIAL_STATE },
      );

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const selectCurrency = screen.getByTestId('currency-input');
      const selectPayment = screen.getByTestId('method-input');
      const selectTag = screen.getByTestId('tag-input');
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);

      userEvent.type(inputValue, value);
      userEvent.selectOptions(selectCurrency, 'EUR');
      userEvent.selectOptions(selectPayment, paymentMethod);
      userEvent.selectOptions(selectTag, category);
      userEvent.type(inputDescription, description);

      expect(inputValue).toHaveValue(value);
      expect(selectCurrency).toHaveValue('EUR');
      expect(selectPayment).toHaveValue(paymentMethod);
      expect(selectTag).toHaveValue(category);
      expect(inputDescription).toHaveValue(description);
    });
    it('Test if dispatch the expense and save it on store and update header', async () => {
      const { store } = renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet],
          initialState: INITIAL_STATE },
      );

      const mockExpense = [{
        id: 0,
        value: '20',
        description: 'BurguerKing',
        currency: 'USD',
        method: 'Dinheiro',
        tag: foodCategory,
        exchangeRates: mockData,
      },
      ];

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });
      fetchMock.mock('https://economia.awesomeapi.com.br/json/all', mockData);

      userEvent.type(inputValue, '20');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called()).toBeTruthy());

      const currentStore = store.getState();
      const expenseValue = screen.getByTestId('total-field');

      expect(currentStore.wallet.expenses).toEqual(mockExpense);
      expect(expenseValue).toBeInTheDocument();
    });
    it('Test if adds more than one expense, it sums', async () => {
      const { store } = renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet],
          initialState: INITIAL_STATE },
      );

      const mockExpense = [{
        id: 0,
        value: '20',
        description: 'BurguerKing',
        currency: 'USD',
        method: 'Dinheiro',
        tag: foodCategory,
        exchangeRates: mockData,
      },
      {
        id: 1,
        value: '30',
        description: 'BurguerKing',
        currency: 'USD',
        method: 'Dinheiro',
        tag: foodCategory,
        exchangeRates: mockData,
      },
      ];

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });

      userEvent.type(inputValue, '20');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called()).toBeTruthy());

      userEvent.type(inputValue, '30');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called).toBeTruthy());

      const currentStore = store.getState();
      const expenseValue = screen.getByTestId('total-field');

      expect(currentStore.wallet.expenses).toEqual(mockExpense);
      expect(expenseValue).toBeInTheDocument();
    });
    it('Test rendering Table', () => {
      renderWithRouterAndRedux(<App />, { initialEntries: [pathWallet] });

      const tableDescription = screen.getByRole('columnheader', { name: /descrição/i });
      const tableTag = screen.getByRole('columnheader', { name: /tag/i });
      const tableMethod = screen.getByRole('columnheader', { name: /método/i });
      const tableValue = screen.getByRole('columnheader', { name: /descrição/i });
      const tableCurrency = screen.getByRole('columnheader', { name: 'Moeda' });
      const tableExchange = screen.getByRole('columnheader', { name: /câmbio/i });
      const tableConvertedValue = screen.getByRole('columnheader', { name: /valor convertido/i });
      const tableConvertCurrency = screen.getByRole('columnheader', { name: 'Moeda de conversão' });
      const tableEditOrRemove = screen.getByRole('columnheader', { name: /editar/i });

      expect(tableDescription).toBeInTheDocument();
      expect(tableTag).toBeInTheDocument();
      expect(tableMethod).toBeInTheDocument();
      expect(tableValue).toBeInTheDocument();
      expect(tableCurrency).toBeInTheDocument();
      expect(tableExchange).toBeInTheDocument();
      expect(tableConvertedValue).toBeInTheDocument();
      expect(tableConvertCurrency).toBeInTheDocument();
      expect(tableEditOrRemove).toBeInTheDocument();
    });
    it('Test if add expense, shows it on the Table', async () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet],
          initialState: INITIAL_STATE },
      );

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });

      userEvent.type(inputValue, '20');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called).toBeTruthy());

      const descriptionOfExpense = screen.getByRole('cell', { name: /burguerking/i });
      const tagOfExpense = screen.getByRole('cell', { name: /alimentação/i });
      const methodOfExpense = screen.getByRole('cell', { name: /dinheiro/i });
      const valueOfExpense = screen.getByRole('cell', { name: '20.00' });
      const currencyOfExpense = screen.getByRole('cell', { name: /real brasileiro/i });
      const exchangeOfExpense = screen.getByRole('cell', { name: '4.75' });
      const convertedValueOfExpense = screen.getByRole('cell', { name: '95.06' });
      const tableConvertCurrency = screen.getByRole('cell', { name: 'Real' });
      const editOrRemoveButtons = screen.getByRole('button', { name: /deletar/i });

      expect(descriptionOfExpense).toBeInTheDocument();
      expect(tagOfExpense).toBeInTheDocument();
      expect(methodOfExpense).toBeInTheDocument();
      expect(valueOfExpense).toBeInTheDocument();
      expect(currencyOfExpense).toBeInTheDocument();
      expect(exchangeOfExpense).toBeInTheDocument();
      expect(convertedValueOfExpense).toBeInTheDocument();
      expect(tableConvertCurrency).toBeInTheDocument();
      expect(editOrRemoveButtons).toBeInTheDocument();
    });
    it('Test clicks on delete button, removes the expense', async () => {
      const { store } = renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet],
          initialState: INITIAL_STATE },
      );

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });

      userEvent.type(inputValue, '20');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called).toBeTruthy());

      console.log(store.getState());

      const removeButtons = screen.getByRole('button', { name: /deletar/i });

      userEvent.click(removeButtons);
      console.log(store.getState());
    });
    it('Test if clicks on edit button, forms button changes', async () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet],
          initialState: INITIAL_STATE },
      );

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });

      userEvent.type(inputValue, '20');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called).toBeTruthy());

      const editButton = screen.getByRole('button', { name: 'Editar' });

      userEvent.click(editButton);

      const editExpenseButton = screen.getByRole('button', { name: editExpense });

      expect(editButton).toBeInTheDocument();
      expect(editExpenseButton).toBeInTheDocument();
    });
    it('Test changing info of a created expense', async () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet],
          initialState: INITIAL_STATE },
      );

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });

      userEvent.type(inputValue, '20');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called).toBeTruthy());

      const editButton = screen.getByRole('button', { name: 'Editar' });

      userEvent.click(editButton);

      const editExpenseButton = screen.getByRole('button', { name: editExpense });

      expect(editButton).toBeInTheDocument();
      expect(editExpenseButton).toBeInTheDocument();

      userEvent.type(inputValue, '40');
      userEvent.type(inputDescription, 'MacDonalds');
      userEvent.click(editExpenseButton);

      expect(submitButton).toBeInTheDocument();
    });
    it('Test changing info of a created expense, and the other not edited stay the same', async () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet],
          initialState: INITIAL_STATE },
      );

      const inputValue = screen.getByTestId(INPUT_TESTID);
      const inputDescription = screen.getByTestId(DESCRIPTION_TESTID);
      const submitButton = screen.getByRole('button', { name: /adicionar/i });

      userEvent.type(inputValue, '20');
      userEvent.type(inputDescription, 'BurguerKing');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called).toBeTruthy());

      userEvent.type(inputValue, '30');
      userEvent.type(inputDescription, 'McDonalds');
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchMock.called).toBeTruthy());

      const editButton = screen.getAllByRole('button', { name: 'Editar' });

      userEvent.click(editButton[0]);

      const editExpenseButton = screen.getByRole('button', { name: editExpense });

      expect(editButton[0]).toBeInTheDocument();
      expect(editExpenseButton).toBeInTheDocument();

      userEvent.type(inputValue, '40');
      userEvent.type(inputDescription, 'MacDonalds');
      userEvent.click(editExpenseButton);

      expect(submitButton).toBeInTheDocument();
    });
  });
});
