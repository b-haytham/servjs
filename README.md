# Servjs 

toy nodejs framework for building http servers inspired by express & koa (for educational purposes)


## Try it

1. Clone the repo

```bash
git clone https://github.com/b-haytham/servjs

npm install 
```
2. Run 

run one the examples in the examples folder


```bash
# npm run dev --example <EXAMPLE_FILE_NAME>

npm run dev --example simple.ts

curl http://localhost:3000
```

## How it works


```typescript
import { Application, Router } from 'src';

const app = new Application();

// ------ router 
const userRouter = new Router('/user') 
userRouter
  .get('/', ctx => ctx.res.send('GET /user'))
  .get('/:id', ctx => ctx.res.send(`GET /user/${ctx.params.id}`))
  .post('/', ctx => ctx.res.send(`POST /user`))
  .put('/:id', ctx => ctx.res.send(`PUT /user/${ctx.params.id}`))
  .patch('/:id/name', ctx => ctx.res.send(`PATCH /user/${ctx.params.id}/name`));

// register router;
app.router(userRouter);


// ----- middleware 
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
//----------------


// ------- state
app.state({ count: 0 }) 

// ctx { req, res, state, query, params }
app.get('/', ctx =>  {
  ctx.state.count = ctx.state.count + 1;  
  ctx.res.send('Hello World');
});
// ---------------


// -------- params & querystrings
// http://localhost:3000/yourname?age=99

app.get('/:name', ctx => {
  const name = ctx.params.name; //yourname;

  const age = ctx.query.age; // 99

  ctx.res.status(200).send(
    JSON.stringify({
      name,
      age,
    }),
  );
});

// --------------------




// ---------errors
app.get('/throws', ctx =>  {
    throw new Error("This Throws");
});

app.error((err, ctx) => {
  console.error(err.message);
  ctx.res.status(500).send(err.message);
});
// ---------------


// ------  websockets

app.ws({
  options: {
    path: '/ws',
    //...
  },
  handlers: {
    onConnect({ server, socket, state }) {
      state.count = state.count + 1;
      socket?.send('Hello');
    },
    onError({ server, socket, state }, err) {
      console.error(err);
    },
    onMessage({ server, socket, state } /*ctx*/, { data, isBin } /* msg */) {
      console.log(data);
      console.log(isBin);
    },
    onClose({ server, socket, state }) {
      state.count = state.count - 1;
    },
  },
});
// ---------------


app.listen(3000, () => console.log('Listening on 3000'));
```


## License
MIT [License](./LICENSE)

