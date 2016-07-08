const Disk = require('../src/Disk/index');
const mkfs = require('../src/mkfs/index');
const mount = require('../src/mount/index');
const mkdir = require('../src/mkdir/index');
const rmdir = require('../src/rmdir/index');
const lsdir = require('../src/lsdir/index');

let localDisk = new Disk('test.fs', 10);
    localDisk = mkfs(localDisk);

const fs = mount(localDisk);
mkdir(fs, '1', '/');
