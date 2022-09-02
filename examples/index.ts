import { Application } from '../src';
import { HttpContext } from '../src/application';
import { Router } from '../src/router';
import { log } from '../src/utils';

const bodyMiddleware = async (ctx: HttpContext) => {
  const raw = await ctx.req.getRawBody();
  ctx.req.body = raw;
};

const userRouter = new Router('/user');

userRouter
  .get('/', ctx => {
    ctx.res.send('Get /user');
  })
  .post('/', ctx => {
    ctx.res.send('Post /user');
  })
  .get('/:id', ctx => {
    ctx.res.send(`Get /user/${ctx.params.id}`);
  });

const app = new Application();

app.router(userRouter);

app.get('/', ctx => {
  ctx.res.status(200).send(JSON.stringify(ctx.req.data));
});

app.post('/:name', bodyMiddleware, async ctx => {
  console.log(ctx.req.body);
  log.log('POST ', ctx.req.params.name);
  ctx.res.status(201).send(JSON.stringify(ctx.req.params.name));
});

app.error((err, ctx) => {
  ctx.res.status(503).send(err.message);
});

app.listen(3000, () => {
  log.log('Server Listening on port :3000');
});
