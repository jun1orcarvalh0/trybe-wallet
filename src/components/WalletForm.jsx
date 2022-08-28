import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import
{ fetchCurrenciesAPI,
  fetchExchangeRates,
  saveUserExpense,
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
    const { dispatchExpense } = this.props;
    const requestApi = await fetchExchangeRates();
    this.setState({
      exchangeRates: requestApi,
    }, () => {
      dispatchExpense({ ...this.state });
      this.setState((prevState) => ({
        id: prevState.id + 1,
        value: '',
        method: 'Dinheiro',
        tag: 'Alimentação',
        description: '',
        exchangeRates: 0,
      }));
    });
  };

  render() {
    const { apiCurrencies } = this.props;
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
        <form onSubmit={ this.handleExpenseSubmit }>
          <label htmlFor="expenseValue">
            Valor:
            <input
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
          <button type="submit">Adicionar Despesa</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  requestCurrencies: async () => {
    dispatch(fetchCurrenciesAPI());
  },
  dispatchExpense: (expense) => dispatch(saveUserExpense(expense)),
});

const mapStateToProps = (state) => ({
  apiCurrencies: state.wallet.currencies,
});

WalletForm.propTypes = {
  requestCurrencies: PropTypes.func.isRequired,
  dispatchExpense: PropTypes.func.isRequired,
  apiCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
