import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

interface IEvent {
  type: string;
  data: any;
}
const events: IEvent[] = [];

app.post('/events', (req: any, res: any) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-clusterip-srv:4000/events', event);
  axios.post('http://comments-srv:4001/events', event);
  axios.post('http://query-srv:4002/events', event);
  axios.post('http://moderation-srv:4003/events', event);

  res.send({ status: 'OK' });
});

app.get('/events', (req: any, res: any) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
