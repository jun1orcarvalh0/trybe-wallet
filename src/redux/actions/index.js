// Coloque aqui suas actions
export const SAVE_USEREMAIL = 'SAVE_EMAIL';
export const SAVE_USERWALLET = 'SAVE_USERWALLET';

export const saveUserEmail = (email) => ({ type: SAVE_USEREMAIL, email });

export const saveUserWallet = (userWallet) => ({ type: SAVE_USERWALLET, userWallet });
