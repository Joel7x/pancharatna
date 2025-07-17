// If you want to keep a basic Express server for future use:
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Payment backend ready for new integration.');
});

app.listen(3001, () => console.log('Server running on port 3001')); 