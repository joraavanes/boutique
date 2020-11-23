const fs = require('fs');

String.prototype.replaceAll = function(find, reaplceWith){
    var str = this.toString();
    
    while(str.includes(find)){
        str = str.replace(find, reaplceWith);
    }

    return str;
};

exports.removeFile = fileUrl => {
    fs.unlink(fileUrl, (err) => {
        if(err) return Promise.reject('Failed file removal');

        return Promise.resolve();
    });
};