import { Application } from '../src';

const app = new Application();

app.get('/', () => {
  throw new Error('Error Get');
});

app.error((err, ctx) => {
  console.error(err.message);
  ctx.res.status(500).send(err.message);
});

export default () => {
  app.listen(3000, () => {
    console.log('Listening on 3000');
  });
};
