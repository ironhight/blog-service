import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

interface IObject<T> {
  [key: string]: T;
}
const posts: IObject<any> = {};

const handleEvent = (
  type: string,
  data: {
    id: string;
    title?: string;
    content?: string;
    postId?: string;
    status?: string;
  }
) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    if (postId) {
      const post = posts[postId];
      post.comments.push({ id, content, status });
    }
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    if (postId) {
      const post = posts[postId];
      const comment = post.comments.find((comment: IObject<any>) => {
        return comment.id === id;
      });

      comment.status = status;
      comment.content = content;
    }
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  const res = await axios.get('http://event-bus-srv:4005/events');

  for (let event of res.data) {
    console.log('Processing event:', event.type);

    handleEvent(event.type, event.data);
  }
});
