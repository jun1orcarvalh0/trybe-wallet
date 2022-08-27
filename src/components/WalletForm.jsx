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
            <option value={ currencies[0] }>USD</option>
            <option value={ currencies[1] }>CAD</option>
            <option value={ currencies[2] }>GBP</option>
            <option value={ currencies[3] }>ARS</option>
            <option value={ currencies[4] }>BTC</option>
            <option value={ currencies[5] }>LTC</option>
            <option value={ currencies[6] }>EUR</option>
            <option value={ currencies[7] }>JPY</option>
            <option value={ currencies[8] }>CHF</option>
            <option value={ currencies[9] }>AUD</option>
            <option value={ currencies[10] }>CNY</option>
            <option value={ currencies[11] }>ILS</option>
            <option value={ currencies[12] }>ETH</option>
            <option value={ currencies[13] }>XRP</option>
            <option value={ currencies[14] }>DOGE</option>
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
