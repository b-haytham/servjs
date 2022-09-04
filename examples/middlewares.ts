import { HttpContext } from 'src/application';
import { Application } from '../src';

const app = new Application();

const authMiddlerware = (ctx: HttpContext) => {
  const authorization = ctx.req.headers.authorization;
  if (!authorization) {
    throw new Error('Not authorized');
  }
  console.log(authorization);

  // get user
  ctx.req.data.user = {
    email: 'user@gmail.com',
  };
};

// curl -H "Authorization: sd65as1dw63a1sd31" http://localhost:3000/protected
app.get('/protected', authMiddlerware, ctx => {
  ctx.res.status(200).send(JSON.stringify(ctx.req.data.user));
});

app.error((err, ctx) => {
  ctx.res.status(403).send(err.message);
});

export default () => {
  app.listen(3000, () => {
    console.log('Listening on 3000');
  });
};
