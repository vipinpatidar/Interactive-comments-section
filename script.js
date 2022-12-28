const container = document.querySelector(".container");
const modelGrayBtn = document.querySelector("#gray-btn");
const modelRedBtn = document.querySelectorAll("#red-btn");

async function fetchData() {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      display(data);
    });
}

fetchData();

function display(data) {
  const html = data.comments
    .map((data) => {
      return `<div class="comment" data-id="${data.id}">
        <div class="comment-header">
          <img src=${data.user.image.png} alt="" />
          <p>${data.user.username}</p>
          <span>${data.createdAt}</span>
          <button id="reply-btn"><i class="fa-solid fa-reply"></i> Reply</button>
        </div>
        <div class="comment-pera">
          <p>
            ${data.content}
          </p>
        </div>
        <div class="comment-score">
          <button>+</button>
          <p>${data.score}</p>
          <button>-</button>
        </div>
      </div>
      ${repliesText(data)}
      `;
    })
    .join("");
  container.innerHTML = html;
  addingTextarea(data);
  deleteComment(data);
  editComment(data);
}

function repliesText(data) {
  const html =
    data.replies.length > 0
      ? data.replies
          .map((reply) => {
            return `<div class="comment reply-comment" data-id="${reply.id}">
        <div class="comment-header">
          <img src=${reply.user.image.png} alt="" />
          <p>${reply.user.username}</p>
          <span>${reply.createdAt}</span>
          ${
            reply.user.username === "juliusomo"
              ? `<div class="delete-edit">
                <button id="delete-btn">
                <i class="fa-solid fa-trash-can"></i> Delete
              </button>
                <button id="edit-btn">
                <i class="fa-solid fa-pen-nib"></i> Ediit
              </button>
              </div>`
              : `<button id="reply-btn">
                <i class="fa-solid fa-reply"></i> Reply
              </button>`
          }
          
        </div>
        <div class="comment-pera">
          <p id ="peraText">
            <span class="replyto">@${reply.replyingTo}</span> ${reply.content}
          </p>
        </div>
        <div class="comment-score">
          <button>+</button>
          <p>${reply.score}</p>
          <button>-</button>
        </div>
         ${
           reply.user.username === "juliusomo"
             ? `<button id="updateBtn">Update</button>`
             : ""
         }
      </div>
        ${reply.replies ? replyText(reply) : ""}`;
          })
          .join("")
      : "";
  return html;
}

function replyText(data) {
  const html =
    data.replies.length > 0
      ? data.replies
          .map((reply) => {
            return `<div class="comment reply-comment" data-id="${reply.id}">
        <div class="comment-header">
          <img src=${reply.user.image.png} alt="" />
          <p>${reply.user.username}</p>
          <span>${reply.createdAt}</span>
          ${
            reply.user.username === "juliusomo"
              ? `<div class="delete-edit">
                <button id="delete-btn">
                <i class="fa-solid fa-trash-can"></i> Delete
              </button>
                <button id="edit-btn">
                <i class="fa-solid fa-pen-nib"></i> Ediit
              </button>
              </div>`
              : `<button id="reply-btn">
                <i class="fa-solid fa-reply"></i> Reply
              </button>`
          }
          
        </div>
        <div class="comment-pera">
          <p id ="peraText">
            <span class="replyto">@${reply.replyingTo}</span> ${reply.content}
          </p>
        </div>
        <div class="comment-score">
          <button>+</button>
          <p>${reply.score}</p>
          <button>-</button>
        </div>
        ${
          reply.user.username === "juliusomo"
            ? `<button id="updateBtn">Update</button>`
            : ""
        }
      </div>
       `;
          })
          .join("")
      : "";
  return html;
}

function addingTextarea(data) {
  const replyBtn = document.querySelectorAll("#reply-btn");
  replyBtn.forEach((rBtn) => {
    rBtn.addEventListener(
      "click",
      function () {
        const textHtml = `<div class="comment-textarea ${
          this.closest(".comment").classList.contains("reply-comment")
            ? "reply-textarea"
            : ""
        }">
        <img src="./images/avatars/image-juliusomo.png" alt="" />
        <textarea name="reply" id="textarea" cols="65" rows="5"></textarea>
        <button id="add-reply-btn">Reply</button>
      </div>`;

        this.closest(".comment").insertAdjacentHTML("afterend", textHtml);
        getText(this.closest(".comment").dataset.id, data);
      },
      { once: true }
    );
  });
}

function getText(id, data) {
  const addReply = document.querySelectorAll("#add-reply-btn");

  addReply.forEach((add) => {
    add.addEventListener("click", function () {
      const textareaValue = document.querySelector("#textarea").value;

      const commentid = data.comments.find((comment) => comment.id === +id);
      let replyid;
      data.comments.forEach((comment) => {
        replyid = comment.replies.find((reply) => reply.id === +id);
      });
      // if (replyid[1]) replyid[1].replies = [];

      const date = new Date();

      const at = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;

      const obj = {
        id: +(Date.now() + "").slice(-10),
        content: textareaValue,
        createdAt: at,
        score: 4,
        replyingTo: replyid ? replyid.user.username : commentid.user.username,
        user: {
          image: {
            png: "./images/avatars/image-juliusomo.png",
            webp: "./images/avatars/image-juliusomo.webp",
          },
          username: "juliusomo",
        },
        replies: [],
      };
      replyid ? replyid.replies.push(obj) : commentid.replies.push(obj);

      data.comments.map((comment) => {
        return repliesText(comment);
      });
      display(data);
    });
  });
}
const model = document.querySelector(".overlay");

function deleteComment(data) {
  const deleteBtn = document.querySelectorAll("#delete-btn");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.closest(".reply-comment").dataset.id;
      model.classList.remove("show");
      modelFun(id, data);
    });
  });
  modelGrayBtn.addEventListener("click", function () {
    model.classList.add("show");
  });
}

function modelFun(id, data) {
  modelRedBtn.forEach((redBtn) => {
    redBtn.addEventListener("click", function () {
      const replyid = data.comments.forEach((comment) => {
        const filtered = comment.replies.filter((reply) => reply.id !== +id);
        comment.replies = filtered;
      });

      const replysReply = data.comments.forEach((comment, i) => {
        comment.replies.forEach((reply, i) => {
          const replyes = reply.replies.filter((reply) => {
            return reply.id !== +id;
          });
          reply.replies = replyes;
        });
      });

      data.comments.map((comment) => {
        return repliesText(comment);
      });
      display(data);
      model.classList.add("show");
    });
  });
}

function editComment(data) {
  const editBtn = document.querySelectorAll("#edit-btn");
  editBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.closest(".reply-comment").dataset.id;
      ////////////////////////////////////////////////////////////////
      const myAnchor =
        this.closest(".reply-comment").querySelector(".comment-pera");
      const myp = this.closest(".reply-comment").querySelector("#peraText");
      const myTextarea = document.createElement("textarea");
      myTextarea.id = "editTextarea";
      myTextarea.cols = "50";
      myTextarea.rows = "5";
      // p1.replaceChild(H, p1.childNodes[0]);
      myAnchor.replaceChild(myTextarea, myAnchor.childNodes[0]);
      myp.parentNode.removeChild(myp);
      const myBtn = this.closest(".reply-comment").querySelector("#updateBtn");
      myBtn.style.display = "block";
      ////////////////////////////////////////////////////////////////
      let filtered = data.comments.map((comment) => {
        return (
          comment.replies.find((reply) => reply.id === +id) ||
          comment.replies.map((reply) =>
            reply.replies.find((reply) => reply.id === +id)
          )
        );
      });

      const flatFiltered = filtered.flat(2);
      const index = flatFiltered.indexOf(undefined);
      flatFiltered.splice(index, 1);
      const filteredId = flatFiltered[0];

      myTextarea.value = `@${filteredId.replyingTo} ${filteredId.content}`;

      updateBtn(id, data);
    });
  });
}

function updateBtn(id, data) {
  const mainEle = document.querySelector(`[data-id="${id}"]`);
  const updateBtn = mainEle.querySelector("#updateBtn");
  console.log(updateBtn);
  updateBtn.addEventListener("click", function () {
    console.log("hi");

    const rC = this.closest(".reply-comment");
    console.log(rC);
    const textValue = rC.querySelector("#editTextarea");
    const commentPera = rC.querySelector(".comment-pera");
    const myPera = document.createElement("p");
    myPera.textContent = textValue.value;

    commentPera.replaceChild(myPera, commentPera.childNodes[0]);
    // textValue.parentNode.removeChild(textValue);
    updateBtn.style.display = "none";
  });
}
