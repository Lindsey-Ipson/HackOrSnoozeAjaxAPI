"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide(); // TODO not working
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When user clicks "submit" in navbar, shows story form */

function showOrHideStoryFormOnNavSubmit() {
  console.debug("showOrHideStoryFormOnNavSubmit")
  $('#story-form').is(':visible') ? $('#story-form').hide() : $('#story-form').show();
}


$navSubmit.on("click", showOrHideStoryFormOnNavSubmit)

/**When user clicks on "Hack or Snoze" in navbar, show main page of
 * latest stories
 * (This is useful for backing out of "favorites" or "my stories" pages)
 */

async function showMainPageOnHackOrSnoozeCick () {
  storyList = await StoryList.getStories();
  putStoriesOnPage();
}

$("#nav-all").on("click", showMainPageOnHackOrSnoozeCick);

/**When user clicks "favorites" in navbar, shows list of favorited stories */

async function showFavorites () {
  console.debug('showFavorites');

  storyList.stories = currentUser.favorites;

  console.log('CURRENT USER--->', currentUser)

  console.log("STORY LIST.stories --->", storyList.stories)

  putStoriesOnPage();
}

$('#nav-favorites').on("click", showFavorites);

function showMyStories () {
  console.debug('showMyStories');
  storyList.stories = currentUser.ownStories;

  console.log(storyList)

  putStoriesOnPage();
}

$('#nav-my-stories').on("click", showMyStories);
