
export function logError(err, req, res, next) {

    console.log('Execute logError middleware');
    
    console.error(err.stack);


    next(err);
}

export function clientErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}   

 