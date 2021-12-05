'use strict';

class ResponseModel {

    constructor(responseCode, data) {
        this.code = responseCode.code;
        this.msg = responseCode.msg;
        this.data = data;
    }
}

export default ResponseModel;
