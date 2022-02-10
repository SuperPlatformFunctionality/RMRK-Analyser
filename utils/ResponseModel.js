

class ResponseModel {

    constructor(responseCode, data) {
        this.code = responseCode.code;
        this.msg = responseCode.msg;
        this.data = data;
    }
}

module.exports = ResponseModel;
