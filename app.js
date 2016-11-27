/**
 * Created by nizural on 27/11/16.
 */
const COMMANDS =
{
    LIST_PORTS: '--list',
    READ_PORT: '--read',
    WRITE_AND_LISTEN: '--write'
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

// read from serial port
if(command === COMMANDS.READ_PORT)
{
    let port = new SerialPort(portName, {parser: SerialPort.parsers.readline('\r\n')});
    port.on('data', (data) => {
        console.log(data);
    });
    port.on('error', (err) =>
    {
        console.error(err);
    });
}

// write to port and listen to response
if(command === COMMANDS.WRITE_AND_LISTEN)
{
    let port = new SerialPort(portName, {parser: SerialPort.parsers.readline('\r\n')});
    port.on('data', (data) =>
    {
        console.log(data);
    });
    port.on('error', (err) =>
    {
        console.error(err);
    });
    port.on('open', () =>
    {
        port.write('$$$\r\nscan\r\n', (err) =>
        {
            console.error(err);
        });
    });
}