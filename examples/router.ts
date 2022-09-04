import { Application, Router } from '../src';

const app = new Application();

const userRouter = new Router('/user'); // prefix /user

userRouter
  .get('/', ctx => ctx.res.send('GET /user'))
  .get('/:id', ctx => ctx.res.send(`GET /user/${ctx.params.id}`))
  .post('/', ctx => ctx.res.send(`POST /user`))
  .put('/:id', ctx => ctx.res.send(`PUT /user/${ctx.params.id}`))
  .patch('/:id/name', ctx => ctx.res.send(`PATCH /user/${ctx.params.id}/name`));

// register router;
app.router(userRouter);

// ctx { req, res, state, query, params }
app.get('/', ctx => ctx.res.send('Hello World'));

export default () => {
  app.listen(3000, () => console.log('Listening on 3000'));
};
