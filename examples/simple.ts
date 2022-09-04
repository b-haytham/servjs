import { Application } from '../src';

const app = new Application();

// ctx { req, res, state, query, params }
app.get('/', ctx => ctx.res.send('Hello World'));

export default () => {
  app.listen(3000, () => console.log('Listening on 3000'));
};
