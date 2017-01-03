/**
 * Created by nizural on 27/11/16.
 */
// importing node-serialport (https://github.com/EmergingTechnologyAdvisors/node-serialport)
const SerialPort = require('serialport');
// programm options
const PROGRAM_COMMANDS = {
    SCAN_WIFI:     'scanWifi',
    RESET_MODULE:  'reset',
    CONFIG_MODULE: 'config',
};
// commands for wifly module
const WIFLY_INSTRUCTIONS = {
    SCAN_WIFI:     ['$$$\r\n', 'scan\r\n',],
    RESET_MODULE:  ['$$$\r\n', 'factory RESET\r\n'],
    CONFIG_MODULE: [
        '$$$\r\n',
        'set wlan ssid <network ssid>\r\n',
        'set wlan phrase <network password>\r\n',
        'set wlan hide 1\r\n',
        'set wlan join 1\r\n',
        'set ip host <host ip>\r\n',
        'set ip remote <host port>\r\n',
        'set ip proto 18',
        'set com remote GET$<route>\r\n',
        'set q sensor 0xff\r\n',
        'set opt format 3\r\n',
        'set opt deviceid <API Key>\r\n',
        'set opt password <string>\r\n',
        'set sys autoconn 255\r\n',
        'set sys wake <value>\r\n',
        'set sys sleep <value>\r\n',
        'save\r\n',
        'reboot\r\n',
    ],
};
// interval between writes in milliseconds
const COMMANDS_INTERVAL = 5000;
// command send to program
const command = process.argv[2];
// port name
const portName = process.argv[3];

switch (command){
    case PROGRAM_COMMANDS.SCAN_WIFI:
        configWifly(portName, WIFLY_INSTRUCTIONS.SCAN_WIFI);
        break;
    case PROGRAM_COMMANDS.RESET_MODULE:
        configWifly(portName, WIFLY_INSTRUCTIONS.RESET_MODULE);
        break;
    case PROGRAM_COMMANDS.CONFIG_MODULE:
        configWifly(portName, WIFLY_INSTRUCTIONS.CONFIG_MODULE);
        break;
    default:
        scanPorts();
        break;
}

/**
 * search for connected serial ports
 */
function scanPorts() {
    SerialPort.list(function (err, ports) {
        console.log('scanning connected ports...');
        ports.forEach((port) => {
            console.log(port.comName);
        });
    });
}

/**
 * write an d listen to serial port
 * @param portName : name of the port
 * @param commands : string[] of commands passed to wifly module
 */
function configWifly(portName, commands) {
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
        // position of current command in commands
        let currentCommand = 0;
        // write a command to port every COMMANDS_INTERVAL milliseconds
        setInterval(() => {
            if(currentCommand < commands.length){
                port.write(commands[currentCommand++]);
            } else {
                console.log('done');
                process.exit();
            }
        }, COMMANDS_INTERVAL);
    });
}