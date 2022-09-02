import { Application } from '../src';
import { log } from '../src/utils';

const app = new Application();

app.listen(3000, () => {
  log.log('Server Listening on port :3000');
});
