const fs = require('fs');

module.exports = (virtualFs, path = '/') => {

    let directoryPath = virtualFs.rootPath + path;
    const disk = virtualFs.getDisk();
    const { root } = virtualFs.getStructure();
    
    if(path == '/') {
        for(let key in root) {
            console.log(root[key].name);    
        }
        
        return ;
    }
    
   
    throw new Error(`Diretorio não existe.`);
  
};