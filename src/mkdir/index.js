const fs = require('fs');
const Inode = require('../Inode/index');
const utils = require('../utils/index');

function createChildren(virtualFs, name, path, children = []) {
    
    try {
        const parents = path.split('/');
        
        for(let key in parents) {
            const name = parents[key];
            path = path + name;
            
            const InodeDirectory = Inode.directory(name);
            
            if(key == parent.length - 1) {
                fs.mkdirSync(path, 0777);
            } else {
                utils.try(() => {
                    fs.mkdirSync(path, 0777);
                });
            }
            
            virtualFs.create(InodeDirectory);
            const child = createChildren(virtualFs, name, path, children);
            children.push(child);
        }
        
        return children;
    } catch(e) {
        throw new Error(e);
    }
    
};

module.exports = (virtualFs, name, path = '/') => {
    
    try {
        const name = virtualFs.rootPath + path + name;
     
        const InodeDirectory = Inode.directory(name);
        
        InodeDirectory.children = createChildren(virtualFs, name, path);
        
        fs.mkdirSync(path, 0777);
    
        virtualFs.create(InodeDirectory);
    } catch(e) {
        throw new Error(e);
    }
    
};