const elements = {
  avatar: {
    container: document.querySelector(".left"),
    image: document.createElement("img")
  },
  nameAndLogin: {
    container: document.querySelector(".middle"),
    name: document.createElement("h1"),
    login: document.createElement("h2")
  },
  bio: {
    container: document.querySelector(".bio"),
    paragraph: document.createElement("p")
  },
  creationDate: {
    container: document.querySelector(".right"),
    paragraph: document.createElement("p")
  },
  activity: {
    repos: {
      container: document.querySelector(".activity__data:nth-child(1)"),
      count: document.createElement("h4")
    },
    followers: {
      container: document.querySelector(".activity__data:nth-child(2)"),
      count: document.createElement("h4")
    },
    following: {
      container: document.querySelector(".activity__data:nth-child(3)"),
      count: document.createElement("h4")
    }
  },
  social: {
    city: {
      container: document.querySelector(".social__link:nth-child(1)"),
      info: document.createElement("p"),
      svg: document.querySelector(".social__link:nth-child(1) path")
    },
    twitter: {
      container: document.querySelector(".social__link:nth-child(2)"),
      account: document.createElement("a"),
      svg: document.querySelector(".social__link:nth-child(2) path")
    },
    website: {
      container: document.querySelector(".social__link:nth-child(3)"),
      link: document.createElement("a"),
      svg: document.querySelector(".social__link:nth-child(3) g")
    },
    company: {
      container: document.querySelector(".social__link:nth-child(4)"),
      name: document.createElement("a"),
      svg: document.querySelector(".social__link:nth-child(4) path")
    }
  },
  errorMessage: document.querySelector(".error")
};

async function fetchUser(username) {
  elements.errorMessage.style.display = "none";

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const parsedResponse = await response.json();

    if (!response.ok) {
      return (elements.errorMessage.style.display = "block");
    }

    return updateDOM(parsedResponse);
  } catch (err) {
    return console.log(err);
  }
}

function updateDOM(data) {
  const { avatar, nameAndLogin, bio, creationDate, activity, social } = elements;

  avatar.image.src = data.avatar_url;
  avatar.image.alt = "Profile avatar";
  avatar.container.appendChild(avatar.image);

  nameAndLogin.name.innerText = data.name;
  nameAndLogin.login.innerText = `@${data.login}`;
  nameAndLogin.container.appendChild(nameAndLogin.name);
  nameAndLogin.container.appendChild(nameAndLogin.login);

  // Bio
  if (data.bio === null) {
    bio.paragraph.innerText = "This profile has no bio";
    bio.paragraph.style.opacity = 0.5;
  } else {
    bio.paragraph.style.opacity = 1;
    bio.paragraph.innerText = data.bio;
  }
  bio.container.appendChild(bio.paragraph);

  // Creation date
  const joinDate = new Date(data.created_at);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const dateFormat = `${joinDate.getDate()} ${months[joinDate.getMonth()]} ${joinDate.getFullYear()}`;
  creationDate.paragraph.innerText = `Joined ${dateFormat}`;
  creationDate.container.appendChild(creationDate.paragraph);

  // Activity
  activity.repos.count.innerText = data.public_repos;
  activity.repos.container.appendChild(activity.repos.count);

  activity.followers.count.innerText = data.followers;
  activity.followers.container.appendChild(activity.followers.count);

  activity.following.count.innerText = data.following;
  activity.following.container.appendChild(activity.following.count);

  // Social
  const { city, twitter, website, company } = social;

  city.info.innerText = data.location || "Not Available";
  city.info.style.opacity = data.location ? 1 : 0.5;
  city.svg.style.opacity = data.location ? 1 : 0.5;
  city.container.appendChild(city.info);

  twitter.account.innerText = data.twitter_username || "Not Available";
  twitter.account.style.opacity = data.twitter_username ? 1 : 0.5;
  twitter.svg.style.opacity = data.twitter_username ? 1 : 0.5;
  twitter.account.href = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : "#";
  twitter.account.target = "_blank";
  twitter.container.appendChild(twitter.account);

  website.link.innerText = data.blog ? data.blog.split("/")[2].split(".app")[0] : "Not Available";
  website.link.style.opacity = data.blog ? 1 : 0.5;
  website.svg.style.opacity = data.blog ? 1 : 0.5;
  website.link.href = data.blog || "#";
  website.link.target = "_blank";
  website.container.appendChild(website.link);

  company.name.innerText = data.company || "Not Available";
  company.name.style.opacity = data.company ? 1 : 0.5;
  company.svg.style.opacity = data.company ? 1 : 0.5;
  company.name.href = data.company ? `https://github.com/${data.company.split("@")[1]}` : "#";
  company.name.target = "_blank";
  company.container.appendChild(company.name);
}

window.onload = () => fetchUser("samueleex");

const searchBtn = document.querySelector("button");
const input = document.getElementById("textInput");

searchBtn.addEventListener("click", () => fetchUser(input.value));

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchUser(input.value);
  }
});
