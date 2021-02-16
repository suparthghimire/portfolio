const handleSubmit = (e) => {
  e.preventDefault();
  let myForm = document.getElementById("contactForm");
  let formData = new FormData(myForm);
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => {
      let notification_msg = document.querySelector(".submit_msg");
      notification_msg.classList = "submit_msg animate-success_enter";
      myForm.reset();
      setTimeout(() => {
        notification_msg.classList = "submit_msg animate-success_exit";
      }, 4000);
    })
    .catch((error) => alert(error));
};

document.querySelector("#contactForm").addEventListener("submit", handleSubmit);
