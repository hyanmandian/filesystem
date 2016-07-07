const fs = require('fs');
const Inode = require('../Inode/index');
const utils = require('../utils/index');


module.exports = (virtualFs, name, path = '/') => {
    
    try {
        let directoryPath = virtualFs.rootPath;
        
        const tempParents = path.split('/')
        const parents = tempParents;
        
        for(let key in parents) {
            const parentName = parents[key];
            
            if(! parentName.length || key == parents.length - 1) continue ;
            
            directoryPath+= '/' + parentName;
            
            const InodeDirectory = Inode.directory(parentName);
            
            utils.try(() => {
                fs.mkdirSync(directoryPath, 0777);
                virtualFs.store(InodeDirectory);
            });
        }
    
        const InodeDirectory = Inode.directory(name);
        virtualFs.store(InodeDirectory);
        fs.mkdirSync(directoryPath + '/' + name, 0777);
    
    } catch(e) {
        throw new Error(`Diretorio ${name} já existe.`);
    }
    
};