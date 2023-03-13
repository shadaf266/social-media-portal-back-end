"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Configuring .env
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//Crucial Imports
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
//Declaring Important variables
const app = (0, express_1.default)();
const port = process.env.PORT;
//Using Middlewares
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
//Routes-->
app.get("/", (req, res) => {
    res.send("Welcome to backend homepage");
});
app.post("/postText", (req, res) => {
    console.log(req.body);
    (0, axios_1.default)({
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
    let options = [];
    req.body.pollOptions.map((e) => {
        options.push({ text: e });
    });
    (0, axios_1.default)({
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
app.post("/postArticle/Link", (req, res) => {
    (0, axios_1.default)({
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
    (0, axios_1.default)({
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
    (0, axios_1.default)({
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
    (0, axios_1.default)({
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
