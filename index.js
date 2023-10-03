const express = require('express');
const app = express();
const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Products');
const categoryRouter = require('./routes/Products');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './config/.env' });
}
const port = process.env.PORT || 5000;

app.use(express.json());

require('./config/db');


app.use('/api/product',productRouter);
app.use('/api/brand',brandRouter);
app.use('/api/category',categoryRouter);


app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
});