var tty = require('tty')
var stdin = process.openStdin();
tty.setRawMode(true);

exports.toggle = function(fireThis)
{
    if (process.argv.indexOf("debug")!=-1)
    {
        console.log("debug flag found, press any key to start or rerun. Press 'ctrl-c' to cancel out!");
        stdin.on('keypress', function (chunk, key) {
            if (key.name == 'c' && key.ctrl == true)
            {
                process.exit();
            }
            fireThis();
        });
    }
    else
    {
        console.log("Running, press any key to rerun or ctrl-c to exit.");
        fireThis();
        stdin.on('keypress', function (chunk, key) {
            if (key.name == 'c' && key.ctrl == true)
            {
                process.exit();
            }
            fireThis();
        });



    }
}
