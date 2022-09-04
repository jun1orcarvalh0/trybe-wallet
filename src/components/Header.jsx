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
      : Number(0).toFixed(2);

    return (
      <div className="header navbar">
        <section className="header-user-email">
          <h3>Usuário:</h3>
          <h3 data-testid="email-field">{ email }</h3>
        </section>
        <section className="header-user-total-expense navbar-end">
          <h3>Despesa total:</h3>
          <h4 data-testid="total-field">{totalOfExpenses}</h4>
          <h4 data-testid="header-currency-field">BRL</h4>
        </section>
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
  expenses: PropTypes.instanceOf(Array).isRequired,
};

export default connect(mapStateToProps, null)(Header);
