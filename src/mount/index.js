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
        const inode = JSON.parse(disk.read(inodes[key].block));
        if(inode.type == 'directory') {
            createDirectory(inode.name, path);
            const childrenRoot = path + inode.name + '/';
            create(disk, inode.children, childrenRoot);
        } else if(inode.type == 'file') {
            createFile();
        }
    }
    
}

function getStructure(disk) {
    const superBlock = JSON.parse(disk.read(0));
    
    return {
        superBlock,
        'root': JSON.parse(disk.read(superBlock['root'])),
        'bitmap': JSON.parse(disk.read(superBlock['bitmap'])),
    };
}

module.exports = (disk) => {
    
    const {
        root,
    } = getStructure(disk);
    
    createDirectory('/', disk.getName());
    
    create(disk, root, disk.getPath() + '/');
   
    return {
        'rootPath': disk.getPath(),
        'store': (inode, inRoot = false) => {
            const {
                superBlock,
                root,
                bitmap,
            } = getStructure(disk);
            
            const block = getEmptyPosition(bitmap);
            
            if(! block) {
                throw new RangeError('Disco não possui espaço disponivel.');
            }
            
            disk.write(block, JSON.stringify(inode));
            
            bitmap[block] = true;
            disk.write(superBlock['bitmap'], JSON.stringify(bitmap));

            if(inRoot) {
                root.push({
                    'name': inode.name,
                    'type': inode.type,
                    'block': block,
                });
                
                disk.write(superBlock['root'], JSON.stringify(root));
            }
            
            return block;
        },
        'update': (block, inode) => {
            disk.write(block, JSON.stringify(inode));
        },
        'destroy': (inode) => {
            const {
                superBlock,
                root,
                bitmap,
            } = getStructure(disk);
            
            bitmap[inode.block] = false;
            disk.write(superBlock['bitmap'], JSON.stringify(bitmap));
            
            delete root[inode.block];
            disk.write(superBlock['root'], JSON.stringify(root));
        },
        'getDisk': () => {
            return disk;
        },
        'getStructure': () => {
            return getStructure(disk);
        },
        
    };
    
};