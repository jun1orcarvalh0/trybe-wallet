import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Table extends Component {
  render() {
    const { walletExpenses } = this.props;
    const walletExpensesHtml = walletExpenses.map((expense) => {
      const { currency, exchangeRates, value } = expense;
      const { name, ask } = exchangeRates[currency];
      const valueRound = Number(value).toFixed(2);
      const askRound = Math.round(ask * 100) / 100;
      const valueConverted = Math.round((value * ask) * 100) / 100;
      return (
        <tr key={ expense.id }>
          <td>{expense.description}</td>
          <td>{expense.tag}</td>
          <td>{expense.method}</td>
          <td>{valueRound}</td>
          <td>{name}</td>
          <td>{askRound}</td>
          <td>{valueConverted}</td>
          <td>Real</td>
        </tr>
      );
    });
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {walletExpensesHtml}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  walletExpenses: state.wallet.expenses,
});

Table.propTypes = {
  walletExpenses: PropTypes.instanceOf(Array).isRequired,
};

export default connect(mapStateToProps, null)(Table);
