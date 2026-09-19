import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import {dirname} from "path";
import {fileURLToPath} from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port=3000;

const posts = [
  {
    id: 1,
    title: "Welcome to my blog",
    content: "A place to share ideas, projects, and stories.",
    image: "/images/featured-post.svg"
  },
  {
    id: 2,
    title: "Designing better experiences",
    content: "Small design decisions can make a big difference for readers.",
    image: "/images/design-post.svg"
  }
];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/newpost", (req, res) => {
  res.render("newpost.ejs");
});

app.get("/viewposts", (req, res) => {
  res.render("viewposts.ejs", { posts });
});

app.get("/update", (req, res) => {
    res.render("update.ejs",{posts});
});

app.get("/update_selected", (req, res) => {
  const postId = parseInt(req.query.postId);
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render("update_selected.ejs", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/update_selected", (req, res) => {
  const postId = parseInt(req.body.postId);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  const { title, content } = req.body;
  if (title && content) {
    post.title = title;
    post.content = content;
  }

  res.redirect("/viewposts");
});

app.get("/delete", (req, res) => { // called when the delete button is clicked in the main blog page
    res.render("delete.ejs", { posts });
});

app.post("/delete", (req, res) => {   /// called when the delete button is clicked on the delte post page
  const postId = parseInt(req.body.postId);
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }

  posts.splice(postIndex, 1);
  res.redirect("/viewposts");
});

app.post("/submit", (req, res) => {
  const { title, content } = req.body;

  if (title && content) {
    posts.push({
      id: Date.now(),
      title,
      content,
      image: "/images/featured-post.svg"
    });
  }

  res.redirect("/viewposts");
});






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
