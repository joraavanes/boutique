String.prototype.replaceAll = function(find, reaplceWith){
    var str = this.toString();
    
    while(str.includes(find)){
        str = str.replace(find, reaplceWith);
    }

    return str;
};
