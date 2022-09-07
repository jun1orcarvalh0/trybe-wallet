// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
import {
  GET_CURRENCIES, SAVE_USEREXPENSE,
  REMOVE_USEREXPENSE, EDIT_USEREXPENSE, EDITED_USEREXPENSE,
} from '../actions';

const INITIAL_STATE = {
  currencies: [], // array de string
  expenses: [], // array de objetos, com cada objeto tendo as chaves id, value, currency, method, tag, description e exchangeRates
  editor: false, // valor booleano que indica de uma despesa está sendo editada
  idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
  expenseToBeEdited: {},
};

const mapEditedExpense = (state, action) => {
  const expenses = state.expenses.map((expense) => {
    if (expense.id === action.editedExpense.id) {
      return action.editedExpense;
    } return expense;
  });
  return {
    ...state,
    expenses,
    editor: false,
  };
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_CURRENCIES:
    return {
      ...state,
      currencies: [...action.currencies],
    };
  case SAVE_USEREXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, action.userExpense],
    };
  case REMOVE_USEREXPENSE:
    return {
      ...state,
      expenses: action.userExpenseRemoved,
    };
  case EDIT_USEREXPENSE:
    return {
      ...state,
      editor: true,
      idToEdit: action.expenseToBeEdited.id,
      expenseToBeEdited: action.expenseToBeEdited,
    };
  case EDITED_USEREXPENSE:
    return mapEditedExpense(state, action);
  default:
    return state;
  }
};

export default wallet;
