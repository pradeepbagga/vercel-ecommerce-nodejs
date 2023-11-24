const express = require('express');
const app = express();
const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brand');
const categoryRouter = require('./routes/Category');
const authRouter = require('./routes/Auth');
const globalErrorHandler = require('./utils/globalError');
const CustomError = require('./utils/CustomError');
const cors = require('cors');
const cookieParser = require('cookie-parser')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './config/.env' });
}
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: `${process.env.FRONTEND_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE','HEAD','PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ],
    credentials: true
};
app.use(cors(corsOptions));



require('./config/db');


app.use('/api/v1/products', productRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/auth', authRouter);


// const path = require('path');
// app.use(express.static(path.resolve(__dirname, 'build')));
// app.get('/', (req, res) =>
//   res.sendFile(path.resolve('build', 'index.html'))
// );
// app.get('/product/*', (req, res) =>
//   res.sendFile(path.resolve('build', 'index.html'))
// );


app.all("*", (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on the Server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the Server!`, 404);
    next(err);
});

app.use(globalErrorHandler);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});