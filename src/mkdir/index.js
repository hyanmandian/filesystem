const fs = require('fs');
const Inode = require('../Inode/index');
const utils = require('../utils/index');
const find = require('../find/index');

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

        if(parents[parseInt(key) + 1]) {
            children[key] = parseInt(key) + 1;
        }
        
        if(key == parents.length - 1) {
            if(find(virtualFs, InodeDirectory.name, directoryPath) == null) {
                try {
                    inodes[key] = virtualFs.store(InodeDirectory, key == 0);
                } catch(e) {
                    throw new Error('Não possui espaço em disco.');
                }
            } else {
                throw new Error('Diretorio já existe.');
            }
        } else {
            const found = find(virtualFs, InodeDirectory.name, directoryPath);

            if(found == null) {
                try {
                    inodes[key] = virtualFs.store(InodeDirectory, key == 0);
                } catch(e) {
                    throw new Error('Não possui espaço em disco.');
                }
            } else {
                inodes[key] = found.block;
            }
        }
    }
    
    const disk = virtualFs.getDisk();
    
    for(let key in children) {
        let directory = JSON.parse(disk.read(inodes[key]));
        const childrenDirectory = JSON.parse(disk.read(inodes[children[key]]));
        let hasChild = false;
        
        for(let key in directory.children) {
            if(directory.children[key].name == childrenDirectory.name) {
                hasChild = true;
            }
        }
        
        if(hasChild == false) {
            directory.children.push({
                'name': childrenDirectory.name,
                'type': childrenDirectory.type,
                'block': inodes[children[key]],
            });
        }
        
        virtualFs.update(inodes[key], directory);
    }
    
};