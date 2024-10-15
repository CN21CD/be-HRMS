const company = require('../model/company');

async function getAllCompanies(req, res) {
    try{
        const companyList = await company.getAllCompanies();
        console.log('Company List:', companyList);
        return res.json(companyList);
    }catch(err){
        console.error('Error fetching company:', err);
        return res.status(500).send('Error fetching company');
    }
}

async function getCompanyById(req, res) {
    const id = req.params.id;
    console.log(`${id}`)
    try{
        const companyListID = await company.getCompanyById(id);
        console.log('Company List ID:', companyListID);
        return res.json(companyListID);
    }catch(err){
        console.error('Error fetching companyID:', err);
        return res.status(500).send('Error fetching companyID');
    }
}
// async function addCompany(req,res){
//     const {company_name,company_phonenumber,company_email,company_address} = req.body;
//     try{
//         const newcompany = await company.addCompany({company_name,company_phonenumber,company_email,company_address});
//         return res.status(201).send('Company adding successfully');
//         // return res.status(201).json(newcompany);
//     }catch(err){
//         console.error('Error adding company:', err);
//         return res.status(500).send('Error adding company');
//     }
// }
async function updateCompanyByID(req,res){
    const company_id = req.params.id;
    const {company_name,company_phonenumber,company_email,company_address} = req.body;
    try{
        const updateCompany = await company.updateCompanyByID({company_id,company_name,company_phonenumber,company_email,company_address});
        res.status(201).send('Company updated successfully');
    }catch(err){
        console.error('Error updating company:', err);
        res.status(500).send('Error updating company');
    }
}
// async function deleteCompanyByID(req,res){
//     const company_id = req.params.id;
//     try{
//         const deleteCompany = await company.deleteCompanyByID(company_id);
//         res.status(201).send('Company deleted successfully');
//     }catch(err){
//         console.error('Error deleting company:', err);
//         res.status(500).send('Error deleting company');
//     }
// }

module.exports = {
    getAllCompanies,
    getCompanyById,
    // addCompany,
    updateCompanyByID,
    // deleteCompanyByID
};