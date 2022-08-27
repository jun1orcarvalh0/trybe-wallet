import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCurrenciesAPI } from '../redux/actions';

class WalletForm extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrenciesAPI());
  }

  render() {
    const { currencies } = this.props;
    const currenciesHtmlElements = currencies.map((currency) => (
      <option
        key={ currency }
        value={ currency }
      >
        {currency}
      </option>
    ));
    return (
      <div>
        <form>
          <input
            type="text"
            name="expenseValue"
            id=""
            data-testid="value-input"
          />
          <input
            type="text"
            name="expenseDescription"
            id=""
            data-testid="description-input"
          />
          <select name="expenseCurrency" data-testid="currency-input" id="">
            { currenciesHtmlElements }
          </select>
          <select name="paymentMethod" data-testid="method-input" id="">
            <option value="money">Dinheiro</option>
            <option value="creditCard">Cartão de crédito</option>
            <option value="debitCard">Cartão de débito</option>
          </select>
          <select name="expenseCategory" data-testid="tag-input" id="">
            <option value="food">Alimentação</option>
            <option value="leisure">Lazer</option>
            <option value="work">Trabalho</option>
            <option value="transport">Transporte</option>
            <option value="health">Saúde</option>
          </select>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
});

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps, null)(WalletForm);
