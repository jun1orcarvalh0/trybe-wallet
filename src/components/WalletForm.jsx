import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fetchExchangeRates from '../services/fetchApi';
import
{ fetchCurrenciesAPI,
  saveUserExpense,
  editedUserExpense,
}
  from '../redux/actions';

const tagFood = 'Alimentação';

class WalletForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: tagFood,
      exchangeRates: 0,
    };
  }

  componentDidMount() {
    const { requestCurrencies } = this.props;
    requestCurrencies();
  }

  componentDidUpdate(_, prevState) {
    this.catchExpenseToBeEdited(prevState);
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExpenseSubmit = async (event) => {
    event.preventDefault();
    const { dispatchExpense, id } = this.props;
    const requestApi = await fetchExchangeRates();
    this.setState({
      exchangeRates: requestApi,
    }, () => {
      dispatchExpense({ ...this.state, id });
      this.setState({
        value: '',
        method: 'Dinheiro',
        tag: tagFood,
        description: '',
        exchangeRates: 0,
      });
    });
  };

  catchExpenseToBeEdited = (prevState) => {
    const { expenseToBeEdited, editor } = this.props;
    if (editor && !prevState.value && !prevState.description) {
      this.setState({
        ...expenseToBeEdited,
      });
    }
  };

  handleExpenseEditedSubmit = (event) => {
    event.preventDefault();
    // const { id, expenseToBeEdited, expenseWasEdited } = this.props;
    const { expenseWasEdited } = this.props;
    // const { exchangeRates } = expenseToBeEdited;
    // const { value, description, currency, method, tag } = this.state;
    expenseWasEdited({ ...this.state });
    this.setState({
      value: '',
      method: 'Dinheiro',
      tag: tagFood,
      description: '',
      exchangeRates: 0,
    });
  };

  render() {
    const { apiCurrencies, editor } = this.props;
    const { value, description, currency, method, tag } = this.state;

    const currenciesHtmlElements = apiCurrencies.map((apiCurrency, index) => (
      <option
        key={ index }
        value={ apiCurrency }
      >
        {apiCurrency}
      </option>
    ));
    return (
      <div className="wallet-form-container">
        <form className="wallet-form">
          <div className="field">
            <input
              className="form-control"
              type="text"
              name="value"
              id="expenseValue"
              data-testid="value-input"
              placeholder="Adicione um valor"
              onChange={ this.handleChange }
              value={ value }
            />
          </div>
          <div className="select is-normal">
            <select
              className="form-select"
              name="currency"
              data-testid="currency-input"
              id="currency"
              onChange={ this.handleChange }
              value={ currency }
              options={ currenciesHtmlElements }
            >
              { currenciesHtmlElements }
            </select>
          </div>
          <div>
            <select
              className="form-select"
              name="method"
              data-testid="method-input"
              id="payment"
              onChange={ this.handleChange }
              value={ method }
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </div>
          <div className="select is-normal">
            <select
              className="form-select"
              name="tag"
              data-testid="tag-input"
              id="category"
              onChange={ this.handleChange }
              value={ tag }
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
          </div>
          <div className="field">
            <input
              className="form-control"
              type="text"
              name="description"
              id="expenseDescription"
              data-testid="description-input"
              placeholder="Adicione uma descrição"
              onChange={ this.handleChange }
              value={ description }
            />
          </div>
          { editor
            ? (
              <button
                type="button"
                className="btn btn-light"
                onClick={ this.handleExpenseEditedSubmit }
              >
                Editar Despesa
              </button>
            )
            : (
              <button
                type="submit"
                className="btn btn-light"
                onClick={ this.handleExpenseSubmit }
              >
                Adicionar Despesa
              </button>)}
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  requestCurrencies: () => {
    dispatch(fetchCurrenciesAPI());
  },
  dispatchExpense: (expense) => dispatch(saveUserExpense(expense)),
  expenseWasEdited: (expenseEdited) => dispatch(editedUserExpense(expenseEdited)),
});

const mapStateToProps = ({ wallet }) => ({
  apiCurrencies: wallet.currencies,
  editor: wallet.editor,
  id: wallet.editor ? wallet.idToEdit : wallet.expenses.length,
  expenseToBeEdited: wallet.expenseToBeEdited,
});

WalletForm.propTypes = {
  requestCurrencies: PropTypes.func.isRequired,
  dispatchExpense: PropTypes.func.isRequired,
  apiCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  editor: PropTypes.bool.isRequired,
  expenseWasEdited: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  expenseToBeEdited: PropTypes.instanceOf(Object).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
