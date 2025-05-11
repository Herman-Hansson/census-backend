require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const participantsRoutes = require('./routes/participantsRoutes');
app.use('/participants', participantsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Census API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
