import React, {useState} from 'react'
import logo from './book_logo_512x512.png';
import './App.css';

//https://www.npmjs.com/package/openai-api ==> npm i openai-api
const OpenAI = require('openai-api');

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const GOOGLE_BOOKS_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
console.log(OPENAI_API_KEY);
console.log(process.env)
const openai = new OpenAI(OPENAI_API_KEY);

function App(){
  const [searchedBookTitle, setSeachedTitle] = useState('');
  const [bookTitle, setTitle] = useState('');
  const [bookDescription, setDescription] = useState('');
  const [bookGenre, setGenre] = useState('');

  function getBookSummary(callback){
    fetch('https://www.googleapis.com/books/v1/volumes?q='+ searchedBookTitle + '&key=' + GOOGLE_BOOKS_API_KEY)
    .then(response => {
        return response.json();
    })
    .then(result => {
        var firstTitle = result.items[0].volumeInfo.title;
        setTitle(firstTitle);
        var firstSummary = result.items[0].volumeInfo.description;
        return callback(firstSummary);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchedBookTitle);
    getBookSummary(function (response){
      setDescription(response);
      console.log(response)}
    );

  // completion
  (async () => {
    const gptResponse = await openai.complete({
      engine: 'davinci',
      prompt: 'This is a book atmosphere identifier\n\nDescription: After discovering the true nature of the One Ring, Bilbo Baggins entrusts it to the care of his young cousin, Frodo, who is charged with bringing about its destruction and thus foiling the plans of the Dark Lord.\nAtmosphere: Fantasy\n\nDescription: The official playscript of the original West End production of Harry Potter and the Cursed Child. It was always difficult being Harry Potter and it isn\'t much easier now that he is an overworked employee of the Ministry of Magic, a husband, and father of three school-age children. While Harry grapples with a past that refuses to stay where it belongs, his youngest son Albus must struggle with the weight of a family legacy he never wanted. As past and present fuse ominously, both father and son learn the uncomfortable truth: sometimes, darkness comes from unexpected places. The playscript for Harry Potter and the Cursed Child was originally released as a \'special rehearsal edition\' alongside the opening of Jack Thorne\'s play in London\'s West End in summer 2016. Based on an original story by J.K. Rowling, John Tiffany and Jack Thorne, the play opened to rapturous reviews from theatregoers and critics alike, while the official playscript became an immediate global bestseller. This revised paperback edition updates the \'special rehearsal edition\' with the conclusive and final dialogue from the play, which has subtly changed since its rehearsals, as well as a conversation piece between director John Tiffany and writer Jack Thorne, who share stories and insights about reading playscripts. This edition also includes useful background information including the Potter family tree and a timeline of events from the wizarding world prior to the beginning of Harry Potter and the Cursed Child.\nAtmosphere: Magical\n\nDescription: It is nothing to die; it is dreadful not to live Accompanying a 6-part series on BBC One from the makers of War and Peace, and starring Dominic West, Lily Collins, David Oyelowo and Olivia Coleman, this edition of Les Misérables also has a foreword from screenwriter Andrew Davies (War and Peace, Pride and Prejudice). Les Misérables is Victor Hugo\'s classic tale of injustice, heroism and love following the fortunes of Jean Valjean, an escaped convict determined to put his criminal past behind him. Those attempts are constantly put under threat: by his own conscience, and by the relentless investigations of the dogged policeman Javert. A compelling and compassionate view of the victims of early nineteenth-century French society, this is a novel on an epic scale, moving from the Battle of Waterloo to the the June rebellion of 1832. \nAtmosphere: Historical\n\nDescription: ' + bookDescription + '\nAtmosphere:',
      maxTokens: 5,
      temperature: 0.7,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      bestOf: 1,
      n: 1,
      stream: false,
      stop: ['\n', "testing"]
  });
    console.log(gptResponse.data);
    var predictedGenre = gptResponse.data.choices[0].text;
    predictedGenre = predictedGenre.replace(/\s/g, '');
    console.log('predictedGenre = ' + predictedGenre);
    setGenre(predictedGenre);
  })();
  }

  return (
    <div className='App'>
      <header className='App-header'>
      <img src={logo} id="book_logo" alt="logo" />
      <div className='searchBookDiv'>
          <h3>Enter Book Title:</h3>
          <form onSubmit={handleSubmit}>
            <input
            id="searchBookTitleBar"
            type="text"
            required    
            onChange={(e) => setSeachedTitle(e.target.value)}
            />
            <button id="confirm_button">Confirm</button>
          </form>
          <p id="searchedBookTitle">Book Title: {bookTitle}</p>
          {/* <p id="bookDescription">Book Description: {bookDescription}</p> */}
          <p id="bookGenre">Book Genre: {bookGenre}</p>
        </div>
    </header>
    </div>
  );
}

export default App;
