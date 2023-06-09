"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug(story instanceof Story);

  const hostName = story.getHostName();

  const isFavoriteStory = currentUser && currentUser.favorites.some(favorite => favorite.storyId === story.storyId);
  const starSymbol = isFavoriteStory ? "★" : "☆";

  // hide the button if the story is NOT the user's
  const hidden = currentUser && currentUser.ownStories.some(own => own.storyId === story.storyId) ? "" : "style=\"display:none;\"";

  return $(`
      <li id="${story.storyId}">
      <div class="star-title-and-hostname">
        <span class="star">${starSymbol}</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        </div>
        <div class="author">
        <small class="story-author">by ${story.author}</small>
        </div>
        <div class="username-and-delete">
        <small class="story-user">posted by ${story.username}</small>
        <span class='delete-button' ${hidden}">delete</span>
        </div>
      </li>
    `);
}

/** Gets list of stories from storyList, generates their HTML,
 * adds event listeners, and places on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $story.find('.star:first').on("click", favOrUnfavStory);
    $story.find('.delete-button:first').on("click", deleteStory)
    $allStoriesList.append($story);
  }
  $storiesContainer.show();
  $allStoriesList.show();
}

/** Called when user submits the form.
  * Gets the data from the form, calls the .addStory method, then puts
  * that new story on the page. 
  **/ 

async function createAndSendStoryOnSubmit() {
  const newStory = {title: $('#title').val(), author: $('#author').val(), url: $('#url').val()};
  const storyInstance = await storyList.addStory(currentUser, newStory);
  currentUser.ownStories.unshift(storyInstance);

  $storyForm.trigger('reset');
  $storyForm.css('display', 'none');

  putStoriesOnPage();
}

$storyForm.on('submit', function (evt) {
  evt.preventDefault();
  createAndSendStoryOnSubmit();
})


