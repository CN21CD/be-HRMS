require('dotenv').config();
const accountService = require('../model/account');

async function getLoginHistory(req, res) {
  try {
    const history = await accountService.getLoginHistory();
    res.json(history);
  } catch (err) {
    console.error('Error fetching login history:', err);
    res.status(500).send('Error fetching login history');
  }
}

async function getLoginHistoryById(req, res) {
  const { account_id } = req.params;
  try {
    const history = await accountService.getLoginHistoryByAccountId(account_id);
    res.json(history);
  } catch (err) {
    console.error('Error fetching login history:', err);
    res.status(500).send('Error fetching login history');
  }
}

async function deleteAccount(req, res) {
  const { account_id } = req.params;
  try {
    await accountService.deleteAccount(account_id);
    res.status(200).send('Account deleted successfully');
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).send('Error deleting account');
  }
}

module.exports = {
  getLoginHistory,
  getLoginHistoryById,
  deleteAccount,
};