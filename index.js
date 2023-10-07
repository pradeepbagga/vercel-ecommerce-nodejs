const express = require('express');
const app = express();
const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brand');
const categoryRouter = require('./routes/Category');
const globalErrorHandler = require('./utils/globalError');
const CustomError = require('./utils/CustomError');
const cors = require('cors');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './config/.env' });
}
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

require('./config/db');


app.use('/api/product',productRouter);
app.use('/api/brand',brandRouter);
app.use('/api/category',categoryRouter);


app.all("*", (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on the Server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the Server!`, 404);
    next(err);
});

app.use(globalErrorHandler);


app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
});