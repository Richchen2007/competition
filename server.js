const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5001;

// MongoDB Atlas 连接字符串
const dbUri = 'your_mongodb_atlas_connection_string';  // 替换为你的 MongoDB Atlas 连接字符串

// 连接到 MongoDB
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// 创建一个用户模型
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
}));

// 使用中间件
app.use(bodyParser.json());
app.use(express.static('public'));  // 允许 public 文件夹中的文件被访问

// POST 路由，处理表单提交
app.post('/signup', (req, res) => {
  const { name, email } = req.body;

  // 创建一个新的用户对象并保存到数据库
  const newUser = new User({ name, email });

  newUser.save()
    .then(() => {
      console.log(`New signup: Name - ${name}, Email - ${email}`);
      res.json({ message: 'Thank you for signing up!' });
    })
    .catch((err) => {
      console.error('Error saving to database:', err);
      res.status(500).json({ message: 'Error saving data' });
    });
});

// GET 路由，查看所有报名人员
app.get('/view-signups', (req, res) => {
  User.find()
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      console.error('Error retrieving users:', err);
      res.status(500).json({ message: 'Error retrieving data' });
    });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});