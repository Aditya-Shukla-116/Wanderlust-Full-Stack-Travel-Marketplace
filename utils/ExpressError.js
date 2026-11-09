class ExpressError extends Error {
      constructor(statusCode , message){
         super(message);        // Initialize this
         this.statusCode = statusCode;  // Now use this
   }
}


module.exports = ExpressError;