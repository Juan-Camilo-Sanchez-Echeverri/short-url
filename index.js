import express, { json } from 'express';
import { connectToMongoDB } from './connect.js';
import urlRoute from './routes/url.js';
import { URL } from './models/url.js';

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(() =>
  console.log('Mongodb connected')
);

app.use(json());

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
