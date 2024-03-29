import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeUserExpense, editUserExpense } from '../redux/actions';

class Table extends Component {
  handleRemove(expenseToBeRemoved) {
    const { walletExpenses, removeExpense } = this.props;
    const expenseStateFiltered = walletExpenses.filter((expenses) => (
      expenses.id !== expenseToBeRemoved.id
    ));
    removeExpense(expenseStateFiltered);
  }

  handleEditButton(expenseToBeEdited) {
    const { editExpense } = this.props;
    editExpense(expenseToBeEdited);
  }

  render() {
    const { walletExpenses } = this.props;
    const walletExpensesHtml = walletExpenses.map((expense) => {
      const { currency, exchangeRates, value } = expense;
      const { name, ask } = exchangeRates[currency];
      const valueRound = Number(value).toFixed(2);
      const askRound = Math.round(ask * 100) / 100;
      const valueConverted = Math.round((value * ask) * 100) / 100;
      return (
        <tr key={ expense.id } className="tr-table">
          <td>{expense.description}</td>
          <td>{expense.tag}</td>
          <td>{expense.method}</td>
          <td>{valueRound}</td>
          <td>{name}</td>
          <td>{askRound}</td>
          <td>{valueConverted}</td>
          <td>Real</td>
          <td>
            <div className="buttons-td">
              <button
                type="submit"
                onClick={ () => this.handleEditButton(expense) }
                className="btn btn-warning"
                data-testid="edit-btn"
              >
                Editar
              </button>
              <button
                type="submit"
                onClick={ () => this.handleRemove(expense) }
                className="btn btn-danger"
                data-testid="delete-btn"
              >
                Deletar
              </button>
            </div>
          </td>
        </tr>
      );
    });
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="tr-header">
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

const mapDispatchToProps = (dispatch) => ({
  removeExpense: (expenses) => dispatch(removeUserExpense(expenses)),
  editExpense: (expense) => dispatch(editUserExpense(expense)),
});

Table.propTypes = {
  walletExpenses: PropTypes.instanceOf(Array).isRequired,
  removeExpense: PropTypes.func.isRequired,
  editExpense: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
