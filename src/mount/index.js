const fs = require('fs');
const utils = require('../utils/index');

function getEmptyPosition(bitmap) {
    for(let key in bitmap) {
        if(bitmap[key] === false) {
            return key;
        }
    }
    
    return null;
}

function createFile() {
    
}

function createDirectory(name, path) {
    utils.try(() => {
        fs.mkdirSync(path + name, 0777) 
    });
}

function create(disk, inodes, path) {
    
    for(let key in inodes) {
        const inode = disk.read(inodes[key].block);
        if(inode.type == 'directory') {
            createDirectory(inode.name, path);
            const childrenRoot = path + inode.name;
            create(disk, inode.children, childrenRoot);
        } else if(inode.type == 'file') {
            createFile();
        }
    }
    
}

module.exports = (disk) => {
    
    const superBlock = JSON.parse(disk.read(0));
    const root = JSON.parse(disk.read(superBlock['root']));
    const bitmap = JSON.parse(disk.read(superBlock['bitmap']));
    
    createDirectory('/', disk.getName());
    
    create(disk, root, disk.getPath());
   
    return {
        'rootPath': disk.getPath(),
        'store': (inode) => {
            const block = getEmptyPosition(bitmap);
            disk.write(block, JSON.stringify(inode));
            
            bitmap[block] = true;
            disk.write(superBlock['bitmap'], JSON.stringify(bitmap));

            root[block] = {
                'name': inode.name,
                'type': inode.type,
                'block': block,
            };
            disk.write(superBlock['root'], JSON.stringify(root));
        },
    };
    
};