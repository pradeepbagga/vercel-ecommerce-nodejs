const CustomError = require('./CustomError');

const castErrorHandler = (error) => {
    const msg = `Invalid value for ${error.path}: ${error.value}`;
    return new CustomError(msg,400);
}

const duplicateKeyErrorHandler = (error) => {
    const keyName = Object.keys(error.keyValue);
    const msg = `There is already a ${keyName[0]} with: ${error.keyValue.title}`;
    return new CustomError(msg,400);
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(error.name == "CastError") {
        error = castErrorHandler(error);
    }

    if(error.code === 11000) {
        error = duplicateKeyErrorHandler(error);
    }

    
    if(error.name == "ValidationError") {
        // console.log('ValidatorError - ', Object.values(error.errors));
        const err = [];
        Object.values(error.errors).map((i) => {
            console.log('i - ', i.properties.message);
            err.push(i.properties.message)
        });
        console.log('ERR - ', err);
        error.message = err;
        
    }

    if(process.env.NODE_ENV == "development") {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
            stackTrace: error.stack,
            error: error
        });
    }
    else if(process.env.NODE_ENV == "production") {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    }
    
}