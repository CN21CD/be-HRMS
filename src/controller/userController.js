const user = require('../model/user');

async function getAllUsers(req, res) {
    const company_id = req.headers['company_id'] || req.headers['Company_ID'];
    console.log('Company ID: by header', company_id);
    
    try {
        const userList = await user.getAllUsers(company_id);
        res.json(userList);
        res.body = userList;
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).send('Error fetching users');
    }
}

async function getUserById(req, res) {
    const id = req.params.id;
    const company_id = req.headers['company_id'] || req.headers['Company_ID'];
    try {
        const userListID = await user.getUserById(id, company_id);
        res.json(userListID);
        res.body = userListID;
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        return res.status(500).send('Error fetching user by ID');
    }
}

// async function addUser(req, res) {
//     const { user_fullname, user_birthday, user_email, user_address, user_phonenumber } = req.body;
//     const company_id = req.headers['company_id'] || req.headers['Company_ID'];
//     try {
//         const newUser = await user.addUser({ user_fullname, user_birthday, user_email, user_address, user_phonenumber, company_id });
//         res.status(201).send('User added successfully');
//         res.body = newUser;
//     } catch (err) {
//         console.error('Error adding user:', err);
//         return res.status(500).send('Error adding user');
//     }
// }

async function updateUserById(req, res) {
    const user_id = req.params.id;
    const { user_fullname, user_birthday, user_email, user_address, user_phonenumber } = req.body;
    const company_id = req.headers['company_id'] || req.headers['Company_ID'];
    try {
        const updateUser = await user.updateUserById({ user_id, user_fullname, user_birthday, user_email, user_address, user_phonenumber, company_id });
        res.status(201).send('User updated successfully');
        res.body = updateUser;
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
}

async function deleteUserById(req, res) {
    const user_id = req.params.id;
    const company_id = req.headers['company_id'] || req.headers['Company_ID'];
    try {
        const deleteUser = await user.deleteUserById(user_id, company_id);
        res.status(201).send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');  
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    // addUser,
    updateUserById,
    deleteUserById
};