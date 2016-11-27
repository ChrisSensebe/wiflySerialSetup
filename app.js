/**
 * Created by nizural on 27/11/16.
 */
const COMMANDS =
{
    LIST_PORTS: '--list',
    READ_PORT: '--read'
};
let command = process.argv[2];
let portName = process.argv[3];
let SerialPort = require('serialport');

// list SerialPort ports
if(command === COMMANDS.LIST_PORTS)
{
    SerialPort.list(function (err, ports)
    {
        ports.forEach((port) =>
        {
            console.log(port.comName);
        });
    });
}

// Read from portName
if(command == COMMANDS.READ_PORT)
{
    let port = new SerialPort(portName);

    port.on('open', () =>
    {
        console.log(`${portName} open, rate: ${port.options.baudRate} bauds`);
    });
}