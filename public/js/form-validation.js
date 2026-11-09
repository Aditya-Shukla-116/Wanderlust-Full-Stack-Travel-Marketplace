// const form = document.querySelector(".listing-form");

// if (form) {
//   form.addEventListener("submit", function (event) {
//     event.preventDefault();

//     // Get values from the form
//     const title = document.querySelector("#title").value.trim();
//     const description = document.querySelector("#description").value.trim();
//     const image = document.querySelector("#image").value.trim();
//     const price = document.querySelector("#price").value;
//     const country = document.querySelector("#country").value.trim();
//     const location = document.querySelector("#location").value.trim();

//     let isValid = true;

//     // ---------------- TITLE ----------------

//     if (title === "") {
//       document.querySelector("#titleError").textContent = "Title is required";

//       isValid = false;
//     } else {
//       document.querySelector("#titleError").textContent = "";
//     }

//     // ---------------- DESCRIPTION ----------------

//     if (description === "") {
//       document.querySelector("#descriptionError").textContent =
//         "Description is required";

//       isValid = false;
//     } else {
//       document.querySelector("#descriptionError").textContent = "";
//     }

//     // ---------------- IMAGE ----------------

//     // if (image === "") {
//     //   document.querySelector("#imageError").textContent =
//     //     "Image URL is required";

//     //   isValid = false;
//     // } else {
//     //   document.querySelector("#imageError").textContent = "";
//     // }

//     // ---------------- PRICE ----------------

//     if (price === "") {
//       document.querySelector("#priceError").textContent = "Price is required";

//       isValid = false;
//     } else if (Number(price) <= 0) {
//       document.querySelector("#priceError").textContent =
//         "Price must be greater than 0";

//       isValid = false;
//     } else {
//       document.querySelector("#priceError").textContent = "";
//     }

//     // ---------------- COUNTRY ----------------

//     if (country === "") {
//       document.querySelector("#countryError").textContent =
//         "Country is required";

//       isValid = false;
//     } else {
//       document.querySelector("#countryError").textContent = "";
//     }

//     // ---------------- LOCATION ----------------

//     if (location === "") {
//       document.querySelector("#locationError").textContent =
//         "Location is required";

//       isValid = false;
//     } else {
//       document.querySelector("#locationError").textContent = "";
//     }

//     // ---------------- FINAL RESULT ----------------

//     if (isValid) {
//       form.submit();
//     }
//   });

//   // Remove title error while typing
//   document.querySelector("#title").addEventListener("input", function () {
//     if (this.value.trim() !== "") {
//       document.querySelector("#titleError").textContent = "";
//     }
//   });

//   // Remove description error while typing
//   document.querySelector("#description").addEventListener("input", function () {
//     if (this.value.trim() !== "") {
//       document.querySelector("#descriptionError").textContent = "";
//     }
//   });

//   // Remove image error while typing
//   document.querySelector("#image").addEventListener("input", function () {
//     if (this.value.trim() !== "") {
//       document.querySelector("#imageError").textContent = "";
//     }
//   });

//   // Remove price error while typing
//   document.querySelector("#price").addEventListener("input", function () {
//     if (this.value !== "" && Number(this.value) > 0) {
//       document.querySelector("#priceError").textContent = "";
//     }
//   });

//   // Remove country error while typing
//   document.querySelector("#country").addEventListener("input", function () {
//     if (this.value.trim() !== "") {
//       document.querySelector("#countryError").textContent = "";
//     }
//   });

//   // Remove location error while typing
//   document.querySelector("#location").addEventListener("input", function () {
//     if (this.value.trim() !== "") {
//       document.querySelector("#locationError").textContent = "";
//     }
//   });
// }


// JavaScript for preventing form submissions when there are invalid fields

(() => {
  'use strict';

  const forms = document.querySelectorAll(".needs-validation");

  for (const form of forms) {
    form.addEventListener("submit", event => {

      // Activate Bootstrap validation styles
      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      for (const control of form.elements) {
        if (control.willValidate) {
          control.setAttribute(
            "aria-invalid",
            String(!control.validity.valid)
          );
        }
      }
    });

    // Update validation when the user corrects a field
    form.addEventListener("input", event => {
      const control = event.target;

      if (control.willValidate &&
          control.hasAttribute("aria-invalid")) {
        control.setAttribute(
          "aria-invalid",
          String(!control.validity.valid)
        );
      }
    });
  }
})();
