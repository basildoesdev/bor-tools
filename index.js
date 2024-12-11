import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());
app.options("*", cors());
app.use(express.static('public'));

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
