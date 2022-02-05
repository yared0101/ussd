const app = require("express")();
const bodyParser = require("body-parser");
// const logger = require('morgan')

const port = process.env.PORT || 3030;

// app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("*", (req, res) => {
    res.send(
        "Get request"
    );
});
const level = [
    "Choolse 1 Level from level 1 ",
    {
        title: "level 1 with child",
        choices: [
            "choose 1 level from level 2",
            {
                title: "level 2 no child",
                returns: () => {
                    return "level 2 done here";
                },
            },
            {
                title: "level 2 with child",
                choices: [
                    "choose 1 level from level 3",
                    {
                        title: "level 3 with no child",
                        returns: () => {
                            return "level 3 done here";
                        },
                    },
                    {
                        title: "level 3 with a child",
                        choices: [
                            "choose 1 level from level 3",
                            {
                                title: "level 4 with no child",
                                returns: () => {
                                    return "returning from level 4";
                                },
                            },
                            {
                                title: "level 4 with no child",
                                returns: () => {
                                    return "returning from level 4";
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        title: "level 1 with million children",
        choices: [
            "choose 1 level from level 2 use # for next page",
            {
                title: "level 2 page 1",
                returns: () => {
                    return "something";
                },
            },
            {
                title: "level 2 page 1",
                returns: () => {
                    return "something";
                },
            },
            {
                title: "level 2 page 2",
                returns: () => {
                    return "something";
                },
            },
            {
                title: "level 2 page 2",
                returns: () => {
                    return "something";
                },
            },
            {
                title: "level 2 page 3",
                returns: () => {
                    return "something";
                },
            },
            {
                title: "level 2 page 3",
                returns: () => {
                    return "something";
                },
            },
            {
                title: "level 2 page 4",
                returns: () => {
                    return "something";
                },
            },
        ],
    },
];
const MAXPAGE = 2;
/**
 *
 * @param {string} str
 */
const stringChanger = (str) => {
    const splitted = str.split("*");
    let returned = [];
    let pageNo = 0;
    let err = false;
    for (let i in splitted) {
        const data = splitted[i];
        if (data.match("#")) {
            pageNo += 1;
        } else if (!data) {
            returned.pop();
            pageNo = 0;
        } else {
            returned.push(data);
            if (data === "0") {
                err = true;
            }
            pageNo = 0;
        }
    }
    if (err) {
        return err;
    }
    return { returned, pageNo };
};

app.post("*", (req, res) => {
    // console.log(req.body);
    let { sessionId, serviceCode, phoneNumber, text } = req.body;
    //if user sends 0, this will throw an error which is what we want
    const { returned, pageNo } = stringChanger(text);
    let data = level;
    console.log({ text, returned, pageNo });
    for (let i in returned) {
        data = data[returned[i]];
        if (data == undefined) {
            console.log("400 here at 1");
            res.status(400).send("Bad request!");
            return;
        }
        if (data.returns) {
            console.log("success here at 1");
            res.send(`END ${data.returns(returned)}`); //maybe add data.title here
            return;
        }

        console.log({ data });
        data = data.choices;
        console.log({ data });
    }
    //if out of the loop the data has choices, therefore its a CON return type;
    let response = `${data[0]}`;
    const loopThrough = data;
    for (let i = pageNo * MAXPAGE + 1; i <= MAXPAGE * (pageNo + 1); i++) {
        const added = loopThrough[i]?.title;
        if (added) {
            response += `\n${i}. ${added}`;
        }
        if (i === pageNo * MAXPAGE + 1) {
            if (!added) {
                console.log(loopThrough, i, loopThrough[i]);
                console.log("400 here at 2");
                res.status(400).send("Bad request!");
                return;
            }
        }
    }
    console.log("success here at 2");
    res.send(`CON ${response}`);
    return;
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
