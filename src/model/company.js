const { Client } = require('pg');
const { config } = require('../../config/dbconfig');

async function getAllCompanies(){
  const client = new Client(config);
  await client.connect();

  const query = 'select * from company_info';
  try{
    const res = await client.query(query); //response
    return res.rows;
  }catch(err){
        console.error('Error fetching company:', err);
        throw err;
    } finally {
        await client.end();
    }
}

async function getCompanyById(id){
  const client = new Client(config);
  await client.connect();

  const query = 'select * from company_info where company_id = $1';
  const values = [id];
  try{
    const res = await client.query(query,values);
    return res.rows;
  }catch(err){
    console.error('Error fetching companyID:', err);
    throw err;
  }finally {
    await client.end();
  } 
}
async function addCompany({company_name,company_phonenumber,company_email,company_address}){
  const client = new Client(config);
  await client.connect();
  const query = `insert into company_info(company_name,company_phonenumber,company_email,company_address)
               values($1,$2,$3,$4)`;
  const values = [company_name,company_phonenumber,company_email,company_address];
  try{
    const res = await client.query(query,values);
    return res.rows;
  }catch(err){
    console.error('Error adding company:', err);
    throw err;
  }finally{
    await client.end();
  }
}
async function updateCompanyByID({company_id,company_name,company_phonenumber,company_email,company_address}){
  const client = new Client(config);
  await client.connect();
  const query = `update company_info
                  set company_name = $2,company_phonenumber = $3,company_email = $4,company_address = $5
                  where company_id = $1`;
  const values = [company_id,company_name,company_phonenumber,company_email,company_address];
  try{
    const res = await client.query(query,values);
    return res.rows;
  }catch(err){
    console.error('Error updating company:', err);
    throw err;
  }finally{
    await client.end();
  }
}
async function deleteCompanyByID(company_id){
  const client = new Client(config);
  await client.connect();
  const query = `delete from company_info where company_id = $1`;
  const values = [company_id];
  try{
    const res = await client.query(query,values);
    return res.rows;
  }catch(err){
    console.error('Error deleting company:', err);
    throw err;
  }finally{
    await client.end();
  }
}

module.exports = {
    getAllCompanies,
    getCompanyById,
    addCompany,
    updateCompanyByID,
    deleteCompanyByID
}