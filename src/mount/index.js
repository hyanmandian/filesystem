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


function getStructure(disk) {
    const superBlock = JSON.parse(disk.read(0));
    
    return {
        superBlock,
        'root': JSON.parse(disk.read(superBlock['root'])),
        'bitmap': JSON.parse(disk.read(superBlock['bitmap'])),
    };
}

module.exports = (disk) => {
    
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