import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { saveUserEmail } from '../redux/actions';
import walletIcon from '../images/wallet-icon2.png';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    isButtonDisabled: true,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      const MIN_PASSWORD = 5;
      const { email, password } = this.state;
      const emailVerify = (email.includes('@') && email.toLowerCase().includes('.com'));
      const passwordVerify = (password.length > MIN_PASSWORD);
      if (emailVerify && passwordVerify) {
        this.setState({
          isButtonDisabled: false,
        });
      } else {
        this.setState({
          isButtonDisabled: true,
        });
      }
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const { dispatch, history } = this.props;

    dispatch(saveUserEmail(email));
    history.push('/trybe-wallet/carteira');
  };

  render() {
    const { email, password, isButtonDisabled } = this.state;
    return (
      <div className="login-form-container">
        <form className="login-form" onSubmit={ this.handleSubmit }>
          <h3 className="login-form-title">TrybeWallet</h3>
          <img
            src={ walletIcon }
            alt="Wallet Coin"
            className="login-image"
          />
          <div className="login-form-inputs">
            <label htmlFor="email">
              Email:
              <input
                type="text"
                id="email"
                className="form-control"
                data-testid="email-input"
                name="email"
                value={ email }
                onChange={ this.handleChange }
              />
            </label>
            <label htmlFor="password">
              Password:
              <input
                type="password"
                id="password"
                className="form-control"
                data-testid="password-input"
                name="password"
                value={ password }
                onChange={ this.handleChange }
              />
            </label>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={ isButtonDisabled }
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(Login);

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
