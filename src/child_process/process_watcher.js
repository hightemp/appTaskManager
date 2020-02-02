
console.log('start fs_watcher process');

process.on('disconnect', function() {
    console.log('parent exited')
    process.exit(2);
});

process.on('SIGTERM', function() {
    console.log('SIGTERM')
    process.exit(4);
});

/*
process.on('SIGKILL', function() {
    console.log('SIGKILL')
    process.exit(5);
});
*/
const aFields = [
    'pid',
    'ppid',
    'name',
    'path',
    'threads',
    'owner',
    'priority',
    'cmdline',
    'starttime',
    'vmem',
    'pmem',
    'cpu',
    'utime',
    'stime',  
];

const { snapshot } = require("process-list");
 
process.on('message', (mMessage) => {
    if (mMessage=='exit') {
        process.exit(3);
    } else {
        snapshot()
            .then((aTasks) => {
                process.send(aTasks);
            })
    }
});

