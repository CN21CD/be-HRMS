const user = require('../model/user');

async function getAllUsers(req, res) {
    try {
        const userList = await user.getAllUsers();
        console.log('User List:', userList);
        return res.json(userList);
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).send('Error fetching users');
    }
}

async function getUserById(req, res) {
    const id = req.params.id;
    console.log(`${id}`)
    try {
        const userListID = await user.getUserById(id);
        console.log('User List ID:', userListID);
        return res.json(userListID);
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        return res.status(500).send('Error fetching user by ID');
    }
}

async function addUser(req, res) {
    const { user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id } = req.body;
    try {
        const newUser = await user.addUser({ user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id });
        return res.status(201).send('User added successfully');
    } catch (err) {
        console.error('Error adding user:', err);
        return res.status(500).send('Error adding user');
    }
}

async function updateUserById(req, res) {
    const user_id = req.params.id;
    const { user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id } = req.body;
    try {
        const updateUser = await user.updateUserById({ user_id, user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id });
        res.status(201).send('User updated successfully');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
}

async function deleteUserById(req, res) {
    const user_id = req.params.id;
    try {
        const deleteUser = await user.deleteUserById(user_id);
        res.status(201).send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUserById,
    deleteUserById
};