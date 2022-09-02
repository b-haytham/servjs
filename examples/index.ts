import { Application } from '../src';
import { HttpContext } from '../src/application';
import { log } from '../src/utils';

const bodyMiddleware = async (ctx: HttpContext) => {
  const raw = await ctx.req.getRawBody();
  ctx.req.body = raw;
};

const app = new Application();

// app.use(firstHandler, secondHandler);

app.get('/', ctx => {
  ctx.res.status(200).send(JSON.stringify(ctx.req.data));
});

app.post('/:name', bodyMiddleware, async ctx => {
  console.log(ctx.req.body);
  log.log('POST ', ctx.req.params.name);
  ctx.res.status(201).send(JSON.stringify(ctx.req.params.name));
});

app.listen(3000, () => {
  log.log('Server Listening on port :3000');
});
