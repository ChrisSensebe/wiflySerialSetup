/**
 * Created by nizural on 27/11/16.
 */
// importing node-serialport (https://github.com/EmergingTechnologyAdvisors/node-serialport)
let SerialPort = require('serialport');
// commands written to port
const COMMANDS = ['$$$\r\n', 'scan\r\n', 'scan\r\n',];
// interval between writes in milliseconds
const COMMANDS_INTERVAL = 5000;

// search device connected on usb
if(option === OPTIONS.LIST_PORTS){
    SerialPort.list(function (err, ports) {
        ports.forEach((port) => {
            if(/USB/.test(port.comName)){
                console.log(port.comName);
                openPort(port.comName);
            }
        });
    });
}

/**
 * write an d listen to serial port
 * @param portName : name of the port
 */
function openPort(portName) {
    // create port
    let port = new SerialPort(portName, {parser: SerialPort.parsers.readline('\r\n')});
    // log data received from port
    port.on('data', (data) => {
        console.log(data);
    });
    // log errors from port
    port.on('error', (err) => {
        console.error(err);
    });
    // on open, write commands to port
    port.on('open', () => {
        console.log(`port ${portName} open`);
        // position of current command in COMMANDS
        let currentCommand = 0;
        // write a command to port every COMMANDS_INTERVAL milliseconds
        setInterval(() => {
            if(currentCommand < COMMANDS.length){
                port.write(COMMANDS[currentCommand++]);
            } else {
                process.exit();
            }
        }, COMMANDS_INTERVAL);
    });
}