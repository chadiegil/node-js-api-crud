const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

const courses = [
  {
    id: 1,
    name: "course1",
  },
  {
    id: 2,
    name: "course2",
  },
  {
    id: 3,
    name: "course3",
  },
];

app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/api/courses", function (req, res) {
  res.send(courses);
});

app.get("/api/courses/:id", function (req, res) {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).send("Course not found");
  }
  res.send(course);
});

app.post("/api/courses/", function (req, res) {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", function (req, res) {
  // look for the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).send("Course not found");
  }
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // update course

  course.name = req.body.name;

  // return the updated course
  res.send(course);
});

app.delete("/api/courses/:id", function (req, res) {
  // look for the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  // if not found return 404
  if (!course) {
    return res.status(404).send("Course not found");
  }
  // delete operation
  const index = courses.indexOf(course);

  courses.splice(index, 1);
  // return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
