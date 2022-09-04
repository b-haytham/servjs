import { Application } from '../src';

const app = new Application();

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

export default () => {
  app.listen(3000, () => {
    console.log('Listening on 3000');
  });
};
