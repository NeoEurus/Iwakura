require('colors');

const getTime = () => {
    return new Date().toISOString();
};

const format = (level, colorFn, message) => {
    const time = getTime().gray;
    const lvl = `[${level}]`[colorFn].bold;
    return `${time} ${lvl} ${message}`;
};

const DEBUG = true;

const logger = {
    info: (msg) => {
        console.log(format('INFO', 'blue', msg));
    },
    warn: (msg) => {
        console.log(format('WARN', 'yellow', msg));
    },
    error: (msg) => {
        console.log(format('ERROR', 'red', msg));
    },
    debug: (msg) => {
        if (DEBUG) {
            console.log(format('DEBUG', 'magenta', msg));
        }
    }
};

module.exports = logger;