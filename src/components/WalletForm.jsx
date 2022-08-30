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

class WalletForm extends Component {
  state = {
    id: 0,
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    exchangeRates: 0,
  };

  componentDidMount() {
    const { requestCurrencies } = this.props;
    requestCurrencies();
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExpenseSubmit = async (event) => {
    event.preventDefault();
    const { dispatchExpense, id, editor, expenseWasEdited } = this.props;
    const requestApi = await fetchExchangeRates();
    this.setState({
      exchangeRates: requestApi,
    }, () => {
      if (editor) expenseWasEdited({ ...this.state, id });
      else dispatchExpense({ ...this.state, id });
      this.setState({
        value: '',
        method: 'Dinheiro',
        tag: 'Alimentação',
        description: '',
        exchangeRates: 0,
      });
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
      <div>
        <form>
          <label htmlFor="expenseValue">
            Valor:
            <input
              label="Valor: "
              type="text"
              name="value"
              id="expenseValue"
              data-testid="value-input"
              onChange={ this.handleChange }
              value={ value }
            />
          </label>
          <label htmlFor="currency">
            Moeda:
            <select
              name="currency"
              data-testid="currency-input"
              id="currency"
              onChange={ this.handleChange }
              value={ currency }
              options={ currenciesHtmlElements }
            >
              { currenciesHtmlElements }
            </select>
          </label>
          <label htmlFor="payment">
            Método de pagamento:
            <select
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
          </label>
          <label htmlFor="category">
            Categoria:
            <select
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
          </label>
          <label htmlFor="expenseDescription">
            Descrição:
            <input
              type="text"
              name="description"
              id="expenseDescription"
              data-testid="description-input"
              onChange={ this.handleChange }
              value={ description }
            />
          </label>
          { editor
            ? (
              <button type="button" onClick={ this.handleExpenseSubmit }>
                Editar Despesa
              </button>
            )
            : (
              <button
                type="submit"
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
});

WalletForm.propTypes = {
  requestCurrencies: PropTypes.func.isRequired,
  dispatchExpense: PropTypes.func.isRequired,
  apiCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  editor: PropTypes.bool.isRequired,
  expenseWasEdited: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
