const fs = require('fs');
const Inode = require('../Inode/index');
const utils = require('../utils/index');

module.exports = (virtualFs, name, path) => {
    
    const {
       root,
    } = virtualFs.getStructure();

    const disk = virtualFs.getDisk();

    let tempPath = path.replace(virtualFs.rootPath, '').split('/');
    let tempParents = [];
    
    for(let key in tempPath) {
        if(! tempPath[key].length) continue ;
        
        tempParents.push(tempPath[key]);
    }
    
    let isRoot = true;
    let searchIn = root;
    
    for(let key in tempParents) {
        tempPath = tempParents[key];
        
        for(let otherKey in searchIn) {
            let block = searchIn[otherKey];

            if(block.name == tempPath) {
                let tempBlock = block.block;
                block = JSON.parse(disk.read(tempBlock));
                block.block = tempBlock;
                
                if(key == tempParents.length - 1) {
                    return block;
                }
                searchIn = block.children;
            }
            
        }
    }
    
    return null;

};