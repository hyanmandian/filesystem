const fs = require('fs');

module.exports = (virtualFs, name, path = '/') => {

    let directoryPath = virtualFs.rootPath + path;
    
    const disk = virtualFs.getDisk();
    const { root } = virtualFs.getStructure();
    
    for(let key in root) {
        const inodeBlock = root[key];
        if(inodeBlock.name == name && inodeBlock.type == 'directory') {
            let inodeDirectory = JSON.parse(disk.read(inodeBlock.block));
            inodeDirectory['block'] = inodeBlock.block;
            fs.rmdirSync(directoryPath + name);
            virtualFs.destroy(inodeDirectory);
            
            return ;
        }
    }
    
    throw new Error(`Diretorio ${name} não existe.`);
  
};