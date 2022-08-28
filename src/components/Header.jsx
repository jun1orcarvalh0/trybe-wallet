import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    const { email, expenses } = this.props;
    const findExpenseAsk = expenses.map((expense) => {
      const { value, currency, exchangeRates } = expense;
      const { ask } = exchangeRates[currency];
      return ask * value;
    });

    const totalOfExpenses = expenses.length > 0
      ? Math.round(findExpenseAsk.reduce((acc, curr) => acc + curr) * 100) / 100
      : 0;

    return (
      <div>
        <h3 data-testid="email-field">{ email }</h3>
        <h4 data-testid="total-field">{totalOfExpenses}</h4>
        <h4 data-testid="header-currency-field">BRL</h4>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user.email,
  expenses: state.wallet.expenses,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps, null)(Header);
