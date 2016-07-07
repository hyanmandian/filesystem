const utils = require('../utils/index');

const structure = {
    'superBlock': 0,
    'root': 1,
    'bitmap': 2,
};

module.exports = (disk) => {
    
    if(disk.getTotalBlocks() < Object.keys(structure).length) 
        throw new Error(`Disco não possui blocos suficientes para criar o sistema de arquivos (mínimo ${Object.keys(structure).length})`)
    
    for(let key in structure) {
        let data = {};
        
        if(key == 'superBlock') {
            for(let key in structure) {
                if(key == 'root' || key == 'bitmap') {
                    data[key] = structure[key];
                }
            }
        } else if(key == 'bitmap') {
            for(let i = 0; i < disk.getTotalBlocks(); i++) {
                data[i] = structure['superBlock'] == i || structure['root'] == i || structure['bitmap'] == i ? true : false;
            }
        }
        
        disk.write(structure[key], JSON.stringify(data));
    }
    
    return disk;
    
};