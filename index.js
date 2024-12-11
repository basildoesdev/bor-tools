import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import pg from 'pg';
const { Client } = pg;

const app = express();

app.use(cors());
app.use(express.json());
app.options("*", cors());
app.use(express.static('public'));

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, 
    },
  });
  
  client.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error", err.stack));

    async function ensureTableExists() {
        try {
        client.connect()
          const query = `
            CREATE TABLE IF NOT EXISTS request_logs (
                id SERIAL PRIMARY KEY,
                request_type TEXT NOT NULL,
                additional_params JSONB NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
          `;
      
          await client.query(query);
          console.log("Ensured table 'request_logs' exists.");
        } catch (err) {
          console.error("Error ensuring table exists:", err);
        } finally {
          await client.end();
        }
      }
      
      ensureTableExists();

setInterval(() => {
    console.log("Heartbeat: Server is active.");
  }, 150000); 

const targetUrl = 'https://classic-api.blackoutrugby.com/';

const _devId = process.env.DEV_ID;
const _devKey = process.env.DEV_KEY;

app.post('/proxy', async (req, res) => {
    const { requestType, additionalParams } = req.body;
    const timestamp = new Date().getTime();
    const API_URL = `${targetUrl}?t=${timestamp}`;

    const mailParams = {
        d: _devId,
        dk: _devKey,
        r: requestType,
        json: 1,
        ...additionalParams,
    };

    try {
        await client.query(
            'INSERT INTO request_logs (request_type, additional_params, timestamp) VALUES ($1, $2, $3)',
            [requestType, additionalParams, timestamp]
        );


        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(mailParams),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
