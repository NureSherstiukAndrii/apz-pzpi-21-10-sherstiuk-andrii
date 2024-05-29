const express = require("express");
const cors = require("cors");
const app = express();

const noAuthRouter = require("./router/noAuthRouter");
const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");
const coachRouter = require("./router/coachRouter");
const postRouter = require("./router/postRouter");
const eventRouter = require("./router/eventRouter");
const companyRouter = require("./router/companyRouter");
const googleBucketRouter = require("./router/googleBucketRouter");

const authMiddleware = require("./middlewares/authMiddleware");

app.use(express.json());
app.use(cors());

app.use('/api', authRouter);
app.use('/api', authMiddleware, userRouter);
app.use('/api', authMiddleware, adminRouter);
app.use('/post', postRouter);
app.use('/coach', coachRouter);
app.use('/events', eventRouter);
app.use('/company', companyRouter);
// app.use('/bucket', googleBucketRouter);
app.use('/unAuth', noAuthRouter);

app.listen(process.env.PORT_SERVER, async () => {
  console.log(`Listening on port ${process.env.PORT_SERVER}`);
});