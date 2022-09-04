import { Application } from '../src';
import { HttpContext } from '../src/application';

const app = new Application();

const bodyMiddelware = async (ctx: HttpContext) => {
  const body = await ctx.req.getRawBody();
  ctx.req.body = body;
};

app.use(bodyMiddelware);

app.post('/', ctx => {
  const body = ctx.req.body; // Buffer;
  console.log(body);

  console.log(body.toString());

  ctx.res.send(body);
});

export default () => {
  app.listen(3000, () => console.log('Listening on 3000'));
};
