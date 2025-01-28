const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//API endpoint to fetch all the reasturants
app.get('/api/get-restaurants', async (req, res) =>{
  try{
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  }catch(error){
    console.error('Error querying the database', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

// API endpoint to fectch restaurant by name
app.get('/api/get-restaurantByName', async(req,res) => {
  const {name} = req.query;
  try{
    const result = await pool.query('SELECT * FROM restaurants WHERE name = $1', [name]);
    res.json(result.rows);
  }catch(error){
    console.error('Error querying the database', error);
    res.status(500).json({error: 'Internal server error'});
  }
})

if(process.env.environment=='local'){
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}