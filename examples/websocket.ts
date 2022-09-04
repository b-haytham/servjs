import { Application } from '../src';

const app = new Application();

app.state({ count: 0, messages: 0 });

app.get('/state', ctx => {
  ctx.res.send(JSON.stringify(ctx.state));
});

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
      state.messages = state.messages + 1;
      console.log(data);
      console.log(isBin);
    },
    onClose({ server, socket, state }) {
      state.count = state.count - 1;
    },
  },
});

export default () => {
  app.listen(3000, () => {
    console.log('Listening on 3000');
  });
};
