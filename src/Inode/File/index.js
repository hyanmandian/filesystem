const moment = require('momentjs');

class File {
    
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.type = 'file',
        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        this.updated_at = this.created_at;
    }
    
}

module.exports = File;