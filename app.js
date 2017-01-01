/**
 * Created by nizural on 27/11/16.
 */
const OPTIONS = {
    LIST_PORTS: '--list',
    READ_PORT: '--read',
    WRITE_AND_LISTEN: '--write'
};

const COMMANDS = ['$$$', '\r\nscan\r\n', '\r\nscan\r\n', '\r\nscan\r\n',];

let option = process.argv[2];
let portName = process.argv[3];
let SerialPort = require('serialport');

// list SerialPort ports
if(option === OPTIONS.LIST_PORTS){
    SerialPort.list(function (err, ports) {
        ports.forEach((port) => {
            if(/USB/.test(port.comName)){
                console.log(port.comName);
            }
        });
    });
}

// read from serial port
if(option === OPTIONS.READ_PORT) {
    let port = new SerialPort(portName, {parser: SerialPort.parsers.readline('\r\n')});
    port.on('data', (data) => {
        console.log(data);
    });
    port.on('error', (err) => {
        console.error(err);
    });
}

// write to port and listen to response
if(option === OPTIONS.WRITE_AND_LISTEN) {
    let port = new SerialPort(portName, {parser: SerialPort.parsers.readline('\r\n')});
    port.on('data', (data) => {
        console.log(data);
    });
    port.on('error', (err) => {
        console.error(err);
    });
    port.on('open', () => {
        console.log('port open');

        let currentCommand = 0;

        setInterval(() => {
            if(currentCommand < COMMANDS.length){
                console.log('write command ', currentCommand);
                port.write(COMMANDS[currentCommand++]);
            } else {
                process.exit();
            }
        }, 6000);
    });
}