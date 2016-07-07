const fs = require('fs');

function getOffset(block, blockSize) {
    return block * blockSize;
}

function getLimit(block, blockSize) {
    return getOffset(block, blockSize) + blockSize;
}

function writeInDisk(disk, buffer) {
    try {
        fs.writeFileSync(disk, buffer, {
            'mode': 0777,
        });
    } catch(e) {
        throw new Error(`Não foi possivel escrever no disco ${disk}.`);
    }
}

class Disk {
    
    constructor(name, blocks = 3, blockSize = 4096) {

        this.name = name;
        this.blocks = blocks
        this.blockSize = blockSize;
        this.buffer = Buffer.alloc(this.blocks * this.blockSize).fill(' ');
        
        try {
            const disk = fs.readFileSync(name);
            
            if(disk.length) {
                this.blocks = disk.length / blockSize;
                this.buffer = disk;
            } else {
                throw new Error(`Disco não existe.`);
            }
        } catch(e) {
            writeInDisk(this.name, this.buffer);
        }
        
    }
    
    write(block, data) {
        data = Buffer.from(data, 'UTF-8');

        if(data.length > this.blockSize) 
            throw new Error(`Tamanho maior que o limite (${this.blockSize}).`); 
        
        const dataBuffer = Buffer.alloc(this.blockSize).fill(' ');
        dataBuffer.write(data.toString(), 0, data.length);
        
        const offset = getOffset(block, this.blockSize);
        const limit = getLimit(block, this.blockSize);
        
        this.buffer.write(dataBuffer.toString(), offset, limit);
        
        writeInDisk(this.name, this.buffer);
    }
    
    read(block) {
        const offset = getOffset(block, this.blockSize);
        const limit = getLimit(block, this.blockSize);
        
        return this.buffer.toString('UTF-8', offset, limit).trim();
    }
    
    getName() {
        return this.name.split('.')[0];
    }
    
    getPath() {
        return './' + this.getName();
    }
    
    getTotalBlocks() {
        return this.blocks;
    }
    
}

module.exports = Disk;