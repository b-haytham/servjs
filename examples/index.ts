const args = process.argv.slice(2);
if (args.length !== 2 && args[0] !== '--example') {
  console.error('Invalid args ');
  console.error('\t npm run dev --example <EXAMPLE>');
  process.exit(1);
}

const example = args[1];

const run = async () => {
  try {
    const runner = await import(`./${example}`);
    runner.default();
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

run();
