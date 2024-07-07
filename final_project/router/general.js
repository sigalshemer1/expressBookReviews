const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
  }


 //registery function
public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (isValid(username)){
          if (!doesExist(username)) { 
              users.push({"username":username,"password":password});
              return res.status(200).json({message: "User successfully registred. Now you can login"});
              } else {
              return res.status(404).json({message: "User already exists!"});    
              }
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  
});





// Get the book list available in the shop using a Promise
public_users.get('/', async function (req, res) {
    try {
      const booksData = await new Promise((resolve, reject) => {
        resolve(books); 
      });
      res.status(200).json(booksData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });


  public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const theISBN = req.params.isbn;
      const booksData = await new Promise((resolve, reject) => {
        for (let key in books) {
            if (key === theISBN) {
                theBook =books[key];
            }
        }
        resolve(theBook); 
      });
      res.status(200).json(booksData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const theAuthor=req.params.author;
    let theBook='';
    try {
        const theISBN = req.params.isbn;
        const booksData = await new Promise((resolve, reject) => {
            for (let key in books) {
                if (books[key].author === theAuthor) {
                    theBook =books[key];
                }
            }
            resolve(theBook); 
      });
      res.status(200).json(booksData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});

/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const theAuthor=req.params.author;
    let theBook='';
    for (let key in books) {
        if (books[key].author === theAuthor) {
            theBook =books[key];
        }
    }
   res.status(200).json(theBook);
});

*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const theTitle=req.params.title;
    let theBook='';
    for (let key in books) {
        if (books[key].title === theTitle) {
            theBook =books[key];
        }
    }
   res.status(200).json(theBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const theISBN=req.params.isbn;
    let theBookReviews='';
    for (let key in books) {
        if (key === theISBN) {
            theBookReviews =books[key].reviews;
        }
    }
   res.status(200).json(theBookReviews);
});

module.exports.general = public_users;

