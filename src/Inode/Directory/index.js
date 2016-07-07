const moment = require('momentjs');

class Directory {
    
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.children = [];
        this.type = 'directory';
        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        this.updated_at = this.created_at;
    }
    
}

module.exports = Directory;