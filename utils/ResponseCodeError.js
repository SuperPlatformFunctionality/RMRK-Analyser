

class ResponseCodeError extends Error {

    constructor(responseCode) {
        super();
        this.name = "ResponseCodeError";
        this.respondCode = responseCode;
    }
}

module.exports = ResponseCodeError;
