//Crucial Imports
import axios from "axios";
import express, { Express, Request, response, Response } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import cors from "cors";

//Declaring Important variables
const upload = multer.memoryStorage();
const app: Express = express();
const port = process.env.PORT;

//Using Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.raw({
    type: "image/jpg",
    limit: "10mb",
  })
);
app.use(
  cors({
    origin: "*",
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));
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
      commentary: req.body.title,
      visibility: req.body.scope,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        media: {
          altText: req.body.altText,
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
  console.log(req.body);
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

app.post(
  "/imageUpload",
  multer({ storage: multer.memoryStorage() }).single("file"),
  (req, res) => {
    console.log(req.file);

    axios({
      url: req.body.url,
      method: "POST",
      data: req.file?.buffer,
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "Content-Type": req?.file?.mimetype,
      },
    })
      .then(() => {
        res.send("Posted");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
);

//Video Apis
app.post("/postVideoStepOne", (req, res) => {
  console.log(req.body);
  axios({
    url: "https://api.linkedin.com/rest/videos?action=initializeUpload",
    method: "POST",
    data: {
      initializeUploadRequest: {
        owner: `urn:li:person:${req.body.id}`,
        fileSizeBytes: 1055736,
        uploadCaptions: false,
        uploadThumbnail: false,
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

app.post(
  "/videoUploadStepTwo",
  multer({ storage: multer.memoryStorage() }).single("file"),
  (req, res) => {
    console.log(req.body);
    console.log(req.file);

    axios({
      url: req.body.url,
      method: "POST",
      data: req.file?.buffer,
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "Content-Type": " application/octet-stream",
      },
    })
      .then((response) => {
        res.send(response.headers.etag);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
);

app.post("/videoFinalizeStepThree", (req, res) => {
  axios({
    url: "https://api.linkedin.com/v2/videos?action=finalizeUpload",
    method: "POST",
    data: {
      finalizeUploadRequest: {
        video: req.body.asset,
        uploadToken: "",
        uploadedPartIds: [req.body.eTag],
      },
    },
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
    },
  })
    .then((response) => {
      console.log(response);
      res.send("Posted");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.post("/postArticle/Video", (req, res) => {
  console.log(req.file);
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
      content: {
        media: {
          title: req.body.videoTitle,
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

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}/`);
});
