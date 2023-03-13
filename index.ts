//Configuring .env
import * as dotenv from "dotenv";
dotenv.config();

//Crucial Imports
import axios from "axios";
import express, { Express, Request, response, Response } from "express";
import bodyParser from "body-parser";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

//Declaring Important variables
const app: Express = express();
const port = process.env.PORT;

//Using Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes-->
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to backend homepage");
});

app.post("/postText", (req: Request, res: Response) => {
  console.log(req.body);
  axios({
    url: "https://api.linkedin.com/rest/posts",
    method: "POST",
    data: {
      author: `urn:li:person:${req.body.id}`,
      commentary: req.body.content,
      visibility: req.body.scope,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    },
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
      "LinkedIn-Version": "202301",
    },
  })
    .then((response) => {
      res.send("completed");
    })
    .catch((err) => {
      res.send("Error");
    });
});

app.post("/postPoll", (req, res) => {
  console.log(req.body);
  let options: Array<object> = [];
  req.body.pollOptions.map((e: string) => {
    options.push({ text: e });
  });
  axios({
    url: "https://api.linkedin.com/rest/posts",
    method: "POST",
    data: {
      author: `urn:li:person:${req.body.id}`,
      commentary: req.body.title,
      visibility: req.body.scope,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
      content: {
        poll: {
          question: req.body.question,
          options: options,
          settings: { duration: "THREE_DAYS" },
        },
      },
    },
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202301",
    },
  })
    .then((response) => {
      console.log(response.data);
      res.send("completed");
    })
    .catch((e) => {
      console.log(e);
      res.send("Error");
    });
});

app.post("/postArticle/Link", (req: Request, res: Response) => {
  axios({
    url: "https://api.linkedin.com/rest/posts",
    method: "POST",
    data: {
      author: `urn:li:person:${req.body.id}`,
      commentary: req.body.text,
      visibility: req.body.scope,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        article: {
          source: req.body.url,
          title: req.body.title,
          description: req.body.content,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    },
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202301",
    },
  })
    .then(() => {
      res.send("completed");
    })
    .catch((err) => {
      console.log(err);
      res.send("Error");
    });
});

app.post("/postArticle/Image", (req, res) => {
  console.log(req.file);
  axios({
    url: "https://api.linkedin.com/rest/posts",
    method: "POST",
    data: {
      author: `urn:li:person:${req.body.id}`,
      commentary: "test strings!",
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        media: {
          altText: "testing for alt tags",
          id: req.body.asset,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    },
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202301",
    },
  })
    .then((response) => {
      console.log(response.data);
      res.send("completed");
    })
    .catch((e) => {
      console.log(e);
      res.send("Error");
    });
});

app.post("/postImageStepOne", (req, res) => {
  axios({
    url: "https://api.linkedin.com/rest/images?action=initializeUpload",
    method: "POST",
    data: {
      initializeUploadRequest: {
        owner: `urn:li:person:${req.body.id}`,
      },
    },
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
      "LinkedIn-Version": "202301",
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.post("/imageUpload", upload.single("files[]"), (req, res) => {
  console.log(req.body);
  axios({
    url: req.body.url,
    method: "POST",
    data: req.body.img,
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
      "Content-Type": "image/png",
    },
  })
    .then((response) => {
      res.send("Posted image");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
