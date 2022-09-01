import { Application } from '../src';

const app = new Application();

app.listen(3000, () => {
  console.log('Listening');
});
