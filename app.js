const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Cronjob = require('cron').CronJob;
const app = express();

mongoose.connect("mongodb://localhost:27017/timetableDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs');

var d = new Date();
var currentDay = d.getDay();

app.use(bodyParser.urlencoded({
    extended: true
}));

const timetableSchema = {
    lesson: String,
    lesson2: String,
    lesson3: String,
    lesson4: String,
    lesson5: String,
    lesson6: String,
    time: String,
    time2: String,
    time3: String,
    time4: String,
    time5: String,
    time6: String,
    teacher: String,
    teacher2: String,
    teacher3: String,
    teacher4: String,
    teacher5: String,
    teacher6: String,
    week: String,
    location: String,
    location2: String,
    location3: String,
    location4: String,
    location5: String,
    location6: String
}
const timetable = mongoose.model("timetable", timetableSchema);

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = ((today - onejan + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7)
};

var today = new Date();
var currentWeekNumber = today.getWeek();
if (currentWeekNumber % 2 === 0) {
    var weekLetter = "A";
} else {
    var weekLetter = "B";
}

console.log(weekLetter)

//REQUEST TRAGETING ALL timetableS//
app.route("/timetable")
    .get(function (req, res) {
        timetable.find(function (err, foundtimetables) {
            if (err) {
                res.send(err);
            } else {
                res.send(foundtimetables);
            }
        });
    })
    .post(function (req, res) {
        console.log(req.body.title);
        console.log(req.body.content);
        const newtimetable = new timetable({
            lesson: req.body.lesson,
            lesson2: req.body.lesson2,
            lesson3: req.body.lesson3,
            lesson4: req.body.lesson4,
            lesson5: req.body.lesson5,
            lesson6: req.body.lesson6,
            time: req.body.time,
            time2: req.body.time2,
            time3: req.body.time3,
            time4: req.body.time4,
            time5: req.body.time5,
            time6: req.body.time6,
            teacher: req.body.teacher,
            teacher2: req.body.teacher2,
            teacher3: req.body.teacher3,
            teacher4: req.body.teacher4,
            teacher5: req.body.teacher5,
            teacher6: req.body.teacher6,
            location: req.body.location,
            location2: req.body.location2,
            location3: req.body.location3,
            location4: req.body.location4,
            location5: req.body.location5,
            location6: req.body.location6,
            week: req.body.week,
        })

        newtimetable.save(function (err) {
            if (!err) {
                console.log("Succesfully added " + req.body.lesson + " with the time " + req.body.time + " and the teacher " + req.body.teacher + ". This is for week " + req.body.week + ".");
            } else {
                console.log(err);
            }
        });

    })
    .delete(function (req, res) {
        timetable.deleteMany(function (err) {
            if (!err) {
                res.send("Succesfully deleted all lessons");
            } else {
                res.send(err);
            }
        });
    });

//REQUEST TRAGETING SPECIFIC lessons//

app.route("/timetable /:timetableTitle")
    .get(function (req, res) {

        timetable.findOne({
            title: req.params.lesson
        }, function (err, foundtimetable) {
            if (foundtimetable) {
                res.send(foundtimetable)
            } else {
                res.send("No timetables matching that title was found.");
            }
        });
    })
    .put(function (req, res) {
        timetable.update({
                title: req.params.lesson,
                time: req.params.time,
                week: req.params.week
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                overwrite: true
            },
            function (err) {
                if (!err) {
                    res.send("Succesfully Updated")
                } else {
                    res.send(err)
                }
            }
        )
    })
    .patch(function (req, res) {
        timetable.update({
                title: req.params.lesson
            }, {
                $set: req.body
            },
            function (err) {
                if (!err) {
                    res.send("Succesfully Updated timetable");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete(function (req, res) {
        timetable.deleteOne({
            title: req.params.lesson
        }, function (err) {
            if (!err) {
                res.send("Succesfully deleted the lesson on " + req.params.lesson)
            } else {
                console.log(err);
            }
        });
    });

app.use(express.static("public"));

var update = new Cronjob('00 00 1 * * *', function () { 
    const e = new Date();
    console.log("Cron starting");
    if (currentDay === 0) {
        timetable.deleteMany(function (err) {
            if (!err) {
                console.log("Succesfully deleted all lessons");
            } else {
                console.log(err);
            }
            const newtimetable = new timetable({
                lesson: "Yay!",
                time: "Its Free Time!",
                teacher: "Its Sundayy",
                week: "Horray!",
                location: "N/A"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });

        });

    } else if (currentDay === 1) {
        timetable.deleteMany(function (err) {
            if (!err) {
                console.log("Succesfully deleted all lessons");
            } else {
                console.log(err);
            }
        });


        if (weekLetter === "A") {
            const newtimetable = new timetable({
                lesson: "Spanish/French/German",
                lesson2: "Geography",
                lesson3: "Art",
                lesson4: "T&P",
                lesson5: "Chemistry",
                lesson6: "Chemistry",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Depends",
                teacher2: "Mr K Lutijn",
                teacher3: "Ms C Coates",
                teacher4: "Mr B Miller",
                teacher5: "Mr D Wheal",
                teacher6: "Mr D Wheal",
                week: "A",
                location: "English or History block",
                location2: "3",
                location3: "3",
                location4: "3",
                location5: "3",
                location6: "3"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        } else { // Week B
            const newtimetable = new timetable({
                lesson: "Spanish/French/German",
                lesson2: "Geography",
                lesson3: "Geography",
                lesson4: "T&P",
                lesson5: "English",
                lesson6: "Chemistry",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Depends",
                teacher2: "Mr K Luteijn",
                teacher3: "Mr K Luteijn",
                teacher4: "Mr B Miller",
                teacher5: "Depends",
                teacher6: "Mr D Wheal",
                week: "A",
                location: "English or History block",
                location2: "3",
                location3: "3",
                location4: "3",
                location5: "English or History block",
                location6: "3"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        }
    } else if (currentDay === 2) {
        timetable.deleteMany(function (err) {
            if (!err) {
                console.log("Succesfully deleted all lessons");
            } else {
                console.log(err);
            }
        });
        if (weekLetter === "A") {
            const newtimetable = new timetable({
                lesson: "Physics",
                lesson2: "Physics",
                lesson3: "English",
                lesson4: "PE",
                lesson5: "Mandarin/Floreat",
                lesson6: "Mathematics",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Mr P Holloway",
                teacher2: "Mr P Holloway",
                teacher3: "Depends",
                teacher4: "Mr D McGall",
                teacher5: "Mr R Wu/",
                teacher6: "Depends",
                week: "A",
                location: "3",
                location2: "3",
                location3: "English or history block",
                location4: "3",
                location5: "",
                location6: "History block"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        } else { // Week B
            const newtimetable = new timetable({
                lesson: "Physics",
                lesson2: "PE",
                lesson3: "English",
                lesson4: "Music",
                lesson5: "Mandarin/",
                lesson6: "Mathematics",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Mr P Holloway",
                teacher2: "Mr D McGall",
                teacher3: "Depends",
                teacher4: "Mr J Newman",
                teacher5: "Mr R Wu/",
                teacher6: "Depends",
                week: "A",
                location: "3",
                location2: "3",
                location3: "English or history block",
                location4: "3",
                location5: "English or history block",
                location6: "History block"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        }
    } else if (currentDay === 3) {
        timetable.deleteMany(function (err) {
            if (!err) {
                console.log("Succesfully deleted all lessons");
            } else {
                console.log(err);
            }
        });
        if (weekLetter === "A") {
            const newtimetable = new timetable({
                lesson: "History",
                lesson2: "Compsci",
                lesson3: "PSHE",
                lesson4: "Music",
                lesson5: "English",
                lesson6: "Mathematics",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Mr M Kearle",
                teacher2: "Depends",
                teacher3: "Mr B Miller",
                teacher4: "Mr J Newman",
                teacher5: "Depends",
                teacher6: "Depends",
                week: "A",
                location: "3",
                location2: "English or history block",
                location3: "3",
                location4: "3",
                location5: "English or history block",
                location6: "History block"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        } else { // Week B
            const newtimetable = new timetable({
                lesson: "Drama",
                lesson2: "English",
                lesson3: "Floreat",
                lesson4: "Spanish/French/German",
                lesson5: "Classics",
                lesson6: "Art",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Mr B Sandiford",
                teacher2: "Depends",
                teacher3: "Mr B Miller",
                teacher4: "Depends",
                teacher5: "Mr M Cooper",
                teacher6: "Ms C Coates",
                week: "A",
                location: "3",
                location2: "English or History block",
                location3: "3",
                location4: "English or History block",
                location5: "3",
                location6: "3"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        }
    } else if (currentDay === 4) {
        timetable.deleteMany(function (err) {
            if (!err) {
                console.log("Succesfully deleted all lessons");
            } else {
                console.log(err);
            }
        });
        if (weekLetter === "A") {
            const newtimetable = new timetable({
                lesson: "History",
                lesson2: "History",
                lesson3: "PSHE",
                lesson4: "Music",
                lesson5: "English",
                lesson6: "Mathematics",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Mr M Kearle",
                teacher2: "Mr M Kearle",
                teacher3: "Mr B Miller",
                teacher4: "Mr J Newman",
                teacher5: "Depends",
                teacher6: "Depends",
                week: "A",
                location: "3",
                location2: "3",
                location3: "3",
                location4: "3",
                location5: "English or history block",
                location6: "History block"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        } else { // Week B
            const newtimetable = new timetable({
                lesson: "Drama",
                lesson2: "English",
                lesson3: "Floreat",
                lesson4: "Spanish/French/German",
                lesson5: "Classics",
                lesson6: "Art",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Mr B Sandiford",
                teacher2: "Depends",
                teacher3: "Mr B Miller",
                teacher4: "Depends",
                teacher5: "Mr M Cooper",
                teacher6: "Ms C Coates",
                week: "A",
                location: "3",
                location2: "English or History block",
                location3: "3",
                location4: "English or History block",
                location5: "3",
                location6: "3"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        }
    } else if (currentDay === 5) {
        timetable.deleteMany(function (err) {
            if (!err) {
                console.log("Succesfully deleted all lessons");
            } else {
                console.log(err);
            }
        });
        if (weekLetter === "A") {
            const newtimetable = new timetable({
                lesson: "Biology",
                lesson2: "PE",
                lesson3: "Compsci",
                lesson4: "Mandarin/",
                lesson5: "Mathmatics",
                lesson6: "Classics",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Miss L Percival",
                teacher2: "Mr D McGall",
                teacher3: "Depends",
                teacher4: "Depends",
                teacher5: "Depends",
                teacher6: "Mr M Cooper",
                week: "A",
                location: "3",
                location2: "3",
                location3: "English or history block",
                location4: "English or history block",
                location5: "History block",
                location6: "3"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        } else { // Week B
            const newtimetable = new timetable({
                lesson: "Biology",
                lesson2: "Biology",
                lesson3: "Compsci",
                lesson4: "PE",
                lesson5: "Mathematics",
                lesson6: "Classics",
                time: "8:25 - 9:00",
                time2: "9:00 - 9:35",
                time3: "9:35 - 10:05",
                time4: "10:45 - 11:19",
                time5: "11:20 - 11:59",
                time6: "12:00 - 12:34",
                teacher: "Miss L Percival",
                teacher2: "Miss L Percival",
                teacher3: "Depends",
                teacher4: "Mr D McGall",
                teacher5: "Depends",
                teacher6: "M",
                week: "A",
                location: "3",
                location2: "3",
                location3: "English or History block",
                location4: "3",
                location5: "History Block",
                location6: "3"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });
        }
    } else if (currentDay === 6) {
        timetable.deleteMany(function (err) {
            if (!err) {
                console.log("Succesfully deleted all lessons");
            } else {
                console.log(err);
            }

            const newtimetable = new timetable({
                lesson: "Yay!",
                time: "Its Free Time!",
                teacher: "Its Saturday!",
                week: "Horray!",
                location: "N/A"
            })

            newtimetable.save(function (err) {
                if (!err) {
                    console.log("Succesfully added");
                } else {
                    console.log(err);
                }
            });

        });
    } else {
        console.log("wtf?")
    }
});


update.start();

app.listen(PROCESS.ENV.PORT || 3000, function (req, res) {
    console.log("Server started on port 3000")
});