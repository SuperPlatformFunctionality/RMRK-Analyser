'use strict';

class ResponseCodeError extends Error {

    constructor(responseCode) {
        super();
        this.name = "ResponseCodeError";
        this.respondCode = responseCode;
    }
}

export default ResponseCodeError;
