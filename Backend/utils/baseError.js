class BaseError extends Error{
    constructor(status, message, statusCode){
        super(message);
        this.statusCode=statusCode;
        this.status=status;
        this.isOperational=true;

        Error.captureStackTrace(this,this.captureStackTrace);
    }
}

module.exports=BaseError;