const File = require('./File/index');
const Directory = require('./Directory/index');

let i = 0;

module.exports = {
    'file': (name) => {
        return new File(++i, name);
    },
    'directory': (name) => {
        return new Directory(++i, name);
    },
};