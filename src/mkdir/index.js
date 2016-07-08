const fs = require('fs');
const Inode = require('../Inode/index');
const utils = require('../utils/index');

module.exports = (virtualFs, name, path = '/') => {
    
    let children = {};
    let inodes = {};
    
    let directoryPath = virtualFs.rootPath;
    
    let tempPath = (path + '/' + name).split('/');
    let tempParents = [];
    
    for(let key in tempPath) {
        if(! tempPath[key].length) continue ;
        
        tempParents.push(tempPath[key]);
    }
    
    const parents = tempParents;
    
    for(let key in parents) {
        const parentName = parents[key];
        
        directoryPath+= '/' + parentName;

        const InodeDirectory = Inode.directory(parentName);
        
        if(parents[parseInt(key + 1)]) {
            children[key] = parseInt(key + 1);
        }
        
        if(key == parents.length - 1) {
            try {
                fs.mkdirSync(directoryPath, 0777);
                inodes[key] = virtualFs.store(InodeDirectory);
            } catch(e) {
                throw new Error(`Diretorio ${name} já existe.`);
            }
        } else {
            utils.try(() => {
                fs.mkdirSync(directoryPath, 0777);
                inodes[key] = virtualFs.store(InodeDirectory, key == 0);
            });
        }
    }
    
    const disk = virtualFs.getDisk();
    
    for(let key in children) {
        utils.try(() => {
            let directory = JSON.parse(disk.read(inodes[key]));
            const childrenDirectory = JSON.parse(disk.read(inodes[children[key]]));
            
            directory.children.push({
                'name': childrenDirectory.name,
                'type': childrenDirectory.type,
                'block': inodes[children[key]],
            });
            
            virtualFs.update(inodes[key], directory);
        })
    }
    
};