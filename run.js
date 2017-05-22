require('dotenv').config();
const Raven      = require('./src/raven.js');
const commands   = require('./src/commands/index.js');
const { argv }   = process;

if (argv.includes('--help') || argv.length <= 2) {
  console.log(`
Usage : node run.js <command1> <command2> <...> --leave-after
Parameters :
    --leave-after It will stop the process after the execution
                  of the command
Commands : ${Object.keys(commands).join(', ')}`
  );
  process.exit(0);
}

argv
  .slice(2)
  .filter((command) => command !== '--leave-after')
  .reduce(async (previous, command) => {
    await previous;
    if (!commands[command]) {
      console.log(`Command "${command}" not found`);
      process.exit(1);
    }
    return commands[command]();
  }, Promise.resolve())
  .then(() => {
    if (process.argv.includes('--leave-after')) {
      process.exit(0);
    }
  })
  .catch((e) => {
    console.log(e);
    Raven.captureException(e, {}, () => {
      process.exit(1);
    });
  })
;