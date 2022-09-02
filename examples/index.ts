import { ServerResponse } from 'http';
import { Application } from '../src';
import { Request } from '../src/request';
import { log } from '../src/utils';

// const firstHandler = (req: Request, res: ServerResponse) => {
//   log.log('First Handler data: ', JSON.stringify(req.data));
//
//   req.data.name = 'haytham';
// };
//
// const secondHandler = (req: Request, res: ServerResponse) => {
//   log.log('Second Handler data: ', JSON.stringify(req.data));
//   res.statusCode = 200;
//   res.end(JSON.stringify(req.data));
// };

const bodyMiddleware = async (req: Request, res: ServerResponse) => {
  const raw = await req.getRawBody();
  req.body = raw;
};

const app = new Application();

// app.use(firstHandler, secondHandler);

app.get('/', (req, res) => {
  res.end(JSON.stringify(req.data));
});

app.post('/:name', bodyMiddleware, async (req, res) => {
  console.log(req.body);
  log.log('POST ', req.params.name);
  res.end(JSON.stringify(req.params.name));
});

app.listen(3000, () => {
  log.log('Server Listening on port :3000');
});
