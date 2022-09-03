import { Application } from '../src';
import { HttpContext } from '../src/application';
import { Router } from '../src/router';
import { log } from '../src/utils';

const app = new Application();

const router = new Router('/user').get('/:id', ctx => {
  ctx.res.send(ctx.params.id);
});

const bodyMiddleware = async (ctx: HttpContext) => {
  const body = await ctx.req.getRawBody();
  ctx.req.body = body;
};

app.router(router);

app.get('/', ctx => {
  ctx.res.status(200).send('Hello');
});

app.post('/', bodyMiddleware, ctx => {
  console.log(ctx.req.body);
  ctx.res.status(200).send(ctx.req.body.toString());
});

app.ws({
  options: { path: '/websocket' },
  handlers: {
    onConnect(ctx) {
      log.trace('State: ', JSON.stringify(ctx.state));
      ctx.state.messages = [];
    },

    onMessage(ctx, msg) {
      console.log('MSG DATA >>>>>>>>', msg.data);
      (ctx.state.messages as any[]).push(msg.data);
    },
    onClose(ctx) {
      console.log(ctx.state.messages);
    },
  },
});

app.listen(3000, () => {
  log.log('Listening 3000');
});
