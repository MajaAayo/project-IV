import { makeApiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const books = await makeApiRequest('/books');
    displayBooks(books);
  } catch (error) {
    console.error('Failed to load books:', error);
    alert('Failed to load books');
  }
});

function displayBooks(books) {
  const container = document.getElementById('books-container');
  container.innerHTML = books.map(book => `
    <div class="book-card">
      <h3>${book.title}</h3>
      <p>By ${book.author}</p>
      <button class="bookmark-btn" data-book-id="${book.id}">
        ${book.isBookmarked ? '★' : '☆'}
      </button>
    </div>
  `).join('');
}


const bookmarkButtons = document.querySelectorAll('.bookmark-button');
const bookmarkCountSpan = document.querySelector('.bookmark-count');
const genreSelect = document.getElementById('genre');
const sortSelect = document.getElementById('sort');
const bookGrid = document.querySelector('.book-grid');
const allBookCards = Array.from(bookGrid.querySelectorAll('.book-card'));

let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

function updateBookmarkCount() {
    bookmarkCountSpan.textContent = `(${bookmarks.length})`;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function addBookToBookmarks(event) {
    const bookCard = event.target.closest('.book-card');
    if (!bookCard) return;

    const title = bookCard.dataset.title;
    const author = bookCard.dataset.author;

    const isBookMarked = bookmarks.some(book => book.title === title);

    if (!isBookMarked) {
        bookmarks.push({ title, author });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        updateBookmarkCount();
        event.target.classList.add('bookmarked');
        event.target.querySelector('i').className = 'fa-solid fa-bookmark';
    } else {
        bookmarks = bookmarks.filter(book => book.title !== title);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        updateBookmarkCount();
        event.target.classList.remove('bookmarked');
        event.target.querySelector('i').className = 'fa-regular fa-bookmark';
    }
}

bookmarkButtons.forEach(button => {
    const bookCard = button.closest('.book-card');
    const title = bookCard.dataset.title;
    const isBookMarked = bookmarks.some(book => book.title === title);
    if (isBookMarked) {
        button.classList.add('bookmarked');
        button.querySelector('i').className = 'fa-solid fa-bookmark';
    }
    button.addEventListener('click', addBookToBookmarks);
});

updateBookmarkCount();

window.addEventListener('storage', (event) => {
    if (event.key === 'bookmarks') {
        bookmarks = JSON.parse(event.newValue) || [];
        updateBookmarkCount();
        bookmarkButtons.forEach(button => {
            const bookCard = button.closest('.book-card');
            const title = bookCard.dataset.title;
            const isBookMarked = bookmarks.some(book => book.title === title);
            if (isBookMarked) {
                button.classList.add('bookmarked');
                button.querySelector('i').className = 'fa-solid fa-bookmark';
            } else {
                button.classList.remove('bookmarked');
                button.querySelector('i').className = 'fa-regular fa-bookmark';
            }
        });
    }
});

function filterBooks() {
    const selectedGenre = genreSelect.value;
    const filteredBooks = selectedGenre
        ? allBookCards.filter(book => book.dataset.genre === selectedGenre)
        : allBookCards;
    return filteredBooks;
}

function sortBooks(books) {
    const sortBy = sortSelect.value;
    switch (sortBy) {
        case 'title_asc':
            return books.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
        case 'title_desc':
            return books.sort((a, b) => b.dataset.title.localeCompare(a.dataset.title));
        case 'author_asc':
            return books.sort((a, b) => a.dataset.author.localeCompare(b.dataset.author));
        case 'author_desc':
            return books.sort((a, b) => b.dataset.author.localeCompare(a.dataset.author));
        // For 'newest', you'd typically need a 'data-release-date' attribute on your book cards
        // and then sort based on that date. Since we don't have that, I'll leave it out for now.
        default:
            return books; // Default to original order if 'relevance' or something else
    }
}

function displayBooks(books) {
    bookGrid.innerHTML = ''; // Clear the current grid
    books.forEach(book => {
        bookGrid.appendChild(book); // Append the filtered and sorted books
    });
}

function applyFiltersAndSort() {
    const filteredBooks = filterBooks();
    const sortedBooks = sortBooks(filteredBooks);
    displayBooks(sortedBooks);
}

genreSelect.addEventListener('change', applyFiltersAndSort);
sortSelect.addEventListener('change', applyFiltersAndSort);

// Initial display
applyFiltersAndSort();

// Book descriptions data
const bookDescriptions = {
  "An Unfinished Love": "Ashoka lives a seemingly perfect life—until a chance encounter with Aurora, a woman who feels hauntingly familiar. Drawn to her by an unexplainable connection, he begins to question everything he thought he knew. As buried emotions resurface, Ashoka finds himself caught between the life he has and a love that refuses to stay in the past. A love story that transcends time and space, exploring the depths of human connection and the power of destiny.",

  "Harry Potter and the Philosopher's Stone": "An orphan. A hidden letter. A school where nothing is as it seems. On his 11th birthday, Harry Potter learns the truth: magic is real, and his parents didn't die in a car crash. But the deeper he goes into Hogwarts, the darker the mysteries become. Why does a three-headed dog guard a trapdoor? And who—or what—is drinking unicorn blood in the Forbidden Forest?",

  "Dune": "A desert planet. A boy who dreams of war. A drug that bends time. Paul Atreides was supposed to inherit a kingdom. Instead, he walks into a trap—one that will force him to choose between survival and vengeance. The sand holds secrets. The spice grants visions. And the worms... they hunger.",

  "The Nightingale": "Two sisters. One Nazi officer. A secret that could kill them all. In occupied France, one sister obeys the rules to protect her daughter. The other joins the Resistance, smuggling downed pilots to safety. But when their paths collide with a German soldier who isn't what he seems, loyalty becomes a deadly game.",

  "The Girl with the Dragon Tattoo": "A missing girl. A locked room. A hacker with a dark past. Forty years ago, Harriet Vanger vanished without a trace. Now, journalist Mikael Blomkvist and the brilliant, violent Lisbeth Salander are about to uncover why—and the answer lies in a family's twisted history, where money hides blood, and silence screams.",

  "The Silent Patient": "She killed her husband. Then she never spoke again. Alicia Berenson seemed to have the perfect life—until she shot her husband five times in the face. Now, locked in a psychiatric facility, she paints eerie self-portraits with one hidden message. A psychotherapist risks everything to crack her silence... but some truths should stay buried.",

  "The Wright Brothers": "Two bicycle mechanics. One impossible dream. And the twelve seconds that changed everything. Orville and Wilbur Wright weren't scientists—they were tinkerers with a vision. While the world laughed, they risked their lives in a wooden contraption, chasing the ancient human fantasy of flight. This is how they defied gravity... and made history.",

  "Guns, Germs, and Steel": "Why did Europe conquer the world? The answer lies in geography... and germs. Jared Diamond's revolutionary theory reveals how accidents of land and livestock gave some societies unstoppable advantages. From the dawn of agriculture to modern empires, this is the story of how the world became unequal—and why your ancestors' latitude determined your destiny.",

  "A Brief History of Time": "What happened before the Big Bang? Do black holes lead to other universes? Stephen Hawking takes us to the edge of physics, where time bends, dimensions multiply, and reality becomes stranger than fiction. In clear, dazzling prose, he explains the universe's greatest mysteries—and the equations that might unlock them.",

  "The Science and the Life of Albert Einstein": "A patent clerk. A miracle year. The theory that shattered Newton's universe. This intimate portrait shows Einstein not as the icon, but as the man—his rebellious youth, his turbulent marriages, his heartbreaking search for a unified theory. Behind the wild hair was a mind that saw deeper into space-time than anyone before... or since.",

  "Mother Teresa": "She heard God's call in a train. Then she walked into hell. Born in Albania, she became the saint of Calcutta's slums, holding the dying when no one else would touch them. But her private letters reveal decades of spiritual darkness—a crisis of faith that makes her compassion even more extraordinary.",

  "Gandhi's Truth": "A young lawyer. A train to Pretoria. The birth of nonviolent revolution. Erik Erikson's psychological masterpiece explores how Gandhi's humiliation in South Africa sparked his world-changing philosophy. Not just a biography, but a meditation on how personal transformation can shake empires—without firing a shot.",

  "Dracula": "A castle with no mirrors. A count who never eats. And a journal that records the impossible. When Jonathan Harker visits Transylvania to finalize a real estate deal, he uncovers a horror beyond reason. Bram Stoker's vampire created the genre—and still chills blood centuries later.",

  "Stephen Hawking - A Life in Science": "A brilliant mind. A failing body. The secrets of the cosmos. Diagnosed with ALS at 21, Hawking was given two years to live. He defied death for five decades, revolutionizing physics while paralyzed and speechless. This is the story of how imagination escaped flesh—and touched the singularity.",

  "The Night Circus": "A circus that appears at midnight. Two magicians bound by a deadly game. And a love that could destroy everything. Le Cirque des Rêves is no ordinary show—its black-and-white tents contain wonders beyond magic. But behind the illusions, two young rivals are playing for stakes neither fully understands... until it's too late.",

  "The Time Machine": "The year is 802,701. Humanity has split into two species: the childlike Eloi and the monstrous Morlocks. H.G. Wells' visionary tale sends a Victorian scientist hurtling through time, where he discovers a future that reflects our darkest class divisions—and the inevitable end of civilization itself.",

  "American Gods": "The old gods are fading. The new ones are worse. Shadow Moon just got out of prison to find his wife dead—and a mysterious job offer from a man called Wednesday. Soon he's on a road trip through America's secret heartland, where deities survive on belief, sacrifice... and blood.",

  "The Martian": "Six astronauts thought he was dead. Now he's the loneliest man in the universe. Stranded on Mars with limited supplies, Mark Watney has two choices: give up or get inventive. Using science, humor, and sheer stubbornness, he battles dust storms, explosions, and the vacuum of space in this gripping survival story.",

  "The Book Thief": "Narrated by Death. Set in Nazi Germany. About the power of words. Liesel Meminger steals books from bonfires, shares them with her neighbors, and reads to a Jewish man hidden in her basement. As bombs fall, she learns that stories can be more nourishing than bread—and more dangerous than any weapon.",

  "Thinking, Fast and Slow": "Your brain has two systems: one fast and emotional, one slow and logical. Nobel winner Daniel Kahneman reveals how they duel in every decision—and why even experts fall prey to cognitive biases. This book will change how you think about thinking... and maybe help you outsmart yourself.",

  "Everyone in This Train Is a Suspect": "A murder mystery writer. A train full of authors. And a killer who knows all the tropes. When someone turns up dead during a literary festival on rails, Ernest Cunningham realizes: the culprit is playing by mystery novel rules. To survive, he must outwrite a murderer who's plotting the perfect ending—for him.",

  "Icebreaker": "She's all discipline. He's all trouble. The ice between them is thinning. Anastasia needs to focus on her Olympic figure skating dreams. Nate is the hockey captain who keeps distracting her. When they're forced to train together, their rivalry turns electric—one wrong move could melt their defenses... or break them both.",

  "To Kill a Mockingbird": "A sleepy Alabama town. A trial that divides it. And the children who watch it unfold. Scout Finch's father is defending a Black man accused of rape in the 1930s South. Through her innocent eyes, we witness prejudice, courage, and the moment childhood ends—when you realize the world isn't fair.",

  "The Alchemist": "A shepherd boy. A recurring dream. And a journey to find treasure beyond gold. Santiago's quest from Spain to Egypt becomes a spiritual awakening, guided by omens and a mysterious alchemist. Paulo Coelho's fable reminds us: the universe conspires to help those who pursue their Personal Legend.",

  "It Ends with Us": "A perfect romance. A dark secret. And the hardest choice a woman can make. Lily fell hard for neurosurgeon Ryle—his intensity, his passion. But when her first love Atlas reappears, cracks appear in her marriage. This isn't a love triangle. It's a story about breaking cycles, even when it shatters your heart.",

  "Atomic Habits": "Tiny changes. Remarkable results. The science of building habits that stick. James Clear proves that success isn't about motivation—it's about systems. Whether quitting bad habits or mastering new skills, his four simple laws can transform your life 1% at a time.",

  "Sapiens: A Brief History of Humankind": "How did an insignificant ape become Earth's dominant species? Yuval Noah Harari's mind-bending history argues: it was our ability to believe in shared myths. From cognitive revolutions to agricultural betrayals, this book will change how you see humanity's 70,000-year journey—and our uncertain future.",

  "The Girl on the Train": "She watches a perfect couple every morning. Until she sees something shocking. Rachel takes the same commuter train daily, fantasizing about 'Jason and Jess'—until she witnesses something that shatters the illusion. But when Jess disappears, Rachel's alcoholism makes her the perfect unreliable witness... or suspect.",

  "Homo Deus: A Brief History of Tomorrow": "Data is the new god. Algorithms know you better than you know yourself. In this chilling sequel to Sapiens, Harari predicts humanity's next evolution—where we may conquer death, but lose our free will to Silicon Valley's digital deities.",

  "Ancient Medieval Nepal": "A Himalayan kingdom where gods walked with men. D.R. Regmi's definitive history chronicles Nepal's golden age—when art flourished, temples touched the sky, and warrior kings battled for the roof of the world. A must-read for anyone seeking the roots of this mystical civilization.",

  "Before I Go to Sleep": "Every morning, her memory resets. Today, she found a warning. Christine wakes up next to a stranger who claims to be her husband. Her doctor says to keep a hidden journal. But as pages fill with contradictions, she realizes: someone in her life is lying... and the truth might be worse than forgetting.",

  "It Starts with Us": "The sequel to It Ends with Us picks up where the heartbreak left off. Lily is finally free from Ryle—but co-parenting with her abusive ex isn't easy. When Atlas reenters her life, she must navigate new love while protecting her daughter. Sometimes the hardest part isn't leaving... it's what comes after.",

  "Think and Grow Rich": "The book that launched a thousand fortunes. Napoleon Hill interviewed 500 millionaires to distill 13 principles of success—from burning desire to the 'sixth sense.' More than money, this 1937 classic teaches how to harness thought itself as your most powerful tool.",

  "Pride": "Zuri Benitez's Brooklyn is changing—and not for the better. When the wealthy Darcy family moves in across the street, she's ready to hate them... especially arrogant Darius. But this modern Pride and Prejudice retelling proves that first impressions lie, and love might bloom where gentrification grows.",

  "Don Quixote": "A madman who thinks he's a knight. A squire who knows better. And adventures that defined literature itself. Cervantes' 17th-century masterpiece follows Alonso Quixano as he tilts at windmills (literally), battles imaginary foes, and reminds us that reality is duller—and less noble—than dreams."
};

// Modal functionality
const bookDetailsModal = document.getElementById('bookDetailsModal');
const closeModalButton = document.querySelector('.close-modal');

// Handle View Details click
document.querySelectorAll('.book-actions a').forEach(button => {
  button.addEventListener('click', function(event) {
      event.preventDefault();
      const bookCard = this.closest('.book-card');
      
      // Populate modal
      document.getElementById('modalBookTitle').textContent = bookCard.dataset.title;
      document.getElementById('modalBookAuthor').textContent = `By ${bookCard.dataset.author}`;
      document.getElementById('modalBookGenre').textContent = bookCard.dataset.genre.replace(/_/g, ' ');
      document.getElementById('modalBookCover').src = bookCard.querySelector('img').src;
      
      const description = bookDescriptions[bookCard.dataset.title] || 
                       "A compelling story that explores deep themes and complex characters.";
      document.getElementById('modalBookDescription').textContent = description;
      
      // Show modal
      bookDetailsModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
  });
});

// Close modal
function closeModal() {
  bookDetailsModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

closeModalButton.addEventListener('click', closeModal);

// Close when clicking outside modal
window.addEventListener('click', (event) => {
  if (event.target === bookDetailsModal) {
      closeModal();
  }
});

// Close with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && bookDetailsModal.style.display === 'block') {
      closeModal();
  }
});