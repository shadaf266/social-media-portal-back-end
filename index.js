"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Crucial Imports
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const upload = multer_1.default.memoryStorage();
var formidable = require("formidable");
//Declaring Important variables
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
//Using Middlewares
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.raw({
    type: "image/jpg",
    limit: "10mb",
}));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
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
app.post("/imageUpload", (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).single("file"), (req, res) => {
    var _a, _b;
    console.log(req.file);
    (0, axios_1.default)({
        url: req.body.url,
        method: "POST",
        data: (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer,
        headers: {
            Authorization: "Bearer " + req.body.accessToken,
            "Content-Type": (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
        },
    })
        .then(() => {
        res.send("Posted");
    })
        .catch((err) => {
        console.log(err);
        res.send(err);
    });
});
//Video Apis
app.post("/postVideoStepOne", (req, res) => {
    console.log(req.body);
    (0, axios_1.default)({
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
app.post("/videoUploadStepTwo", (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).single("file"), (req, res) => {
    var _a;
    console.log(req.body);
    console.log(req.file);
    (0, axios_1.default)({
        url: req.body.url,
        method: "POST",
        data: (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer,
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
});
app.post("/videoFinalizeStepThree", (req, res) => {
    (0, axios_1.default)({
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
