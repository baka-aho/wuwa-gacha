// Get all the relevant elements
var elements = document.querySelectorAll(
  "div.flex.w-full.flex-1.items-center.justify-between.gap-2.text-center p.text-xl.font-bold"
);
var currentPity = 5;
var totalPulls = 0;

// Fetch the JSON data from the URL
fetch(
  "https://raw.githubusercontent.com/baka-aho/wuwa-gacha/refs/heads/main/resonator.json"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const characters = data.characters; // Access the characters array

    // Select the specific container for character elements
    const container = document.querySelector(".p-6.grid.gap-x-4.gap-y-2");
    // Clear existing character content
    container.innerHTML = "";

    // Create new character elements based on the fetched JSON data
    characters.forEach((character) => {
      totalPulls += character.value;
      const characterDiv = document.createElement("div");
      characterDiv.className = "relative h-16 w-16 place-self-center";

      const imgContainer = document.createElement("div");
      imgContainer.className =
        "h-16 w-16 overflow-hidden rounded-full bg-muted/50";

      const img = document.createElement("img");
      img.alt = character.name; // Ensure this matches your JSON structure
      img.loading = "lazy";
      img.width = 404;
      img.height = 560;
      img.src = character.image; // Ensure this matches your JSON structure
      img.style.color = "transparent";

      imgContainer.appendChild(img);
      characterDiv.appendChild(imgContainer);

      const badge = document.createElement("div");
      badge.className = "";

      // Set the class of the badge based on its value
      if (character.value < 60 && character.value > 39) {
        badge.className =
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-700 text-white hover:bg-yellow-700/80 absolute -bottom-1 -right-1 flex aspect-square w-7 items-center justify-center";
      } else if (character.value > 59) {
        badge.className =
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 absolute -bottom-1 -right-1 flex aspect-square w-7 items-center justify-center";
      } else {
        badge.className =
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-700 text-white hover:bg-green-700/80 absolute -bottom-1 -right-1 flex aspect-square w-7 items-center justify-center";
      }

      badge.textContent = character.value;
      characterDiv.appendChild(badge);
      container.appendChild(characterDiv);
    });

    // Update the total pulls and astrites
    if (elements.length === 4) {
      totalPulls = totalPulls + currentPity;
      var astrites = totalPulls * 160;
      var fourStars = Math.ceil(totalPulls / 10 - 14);
      var fiveStars = characters.length;

      // Update the values
      elements[0].textContent = totalPulls.toLocaleString();
      elements[1].textContent = astrites.toLocaleString();
      elements[2].textContent = fourStars.toLocaleString();
      elements[3].textContent = fiveStars.toLocaleString();
    } else {
      console.error("Expected 4 elements but found:", elements.length);
    }

    // Now update the table with the same data
    const tableBody = document.querySelector("tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Create new rows based on the characters array
    characters.forEach((item) => {
      const row = document.createElement("tr");
      row.className =
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";

      row.innerHTML = `
        <td class="p-4 align-middle py-2 sm:py-3">${item.pullno}</td>
        <td class="p-4 align-middle py-2 sm:py-3">
            <div class="flex items-center justify-center gap-3 xsm:w-fit">
                <div class="h-[24px] w-[24px] overflow-clip rounded-full">
                    <img alt="${item.name}" loading="lazy" width="24" height="24" src="${item.image}" style="color: transparent;">
                </div>
                <p class="line-clamp-1 text-xs font-semibold text-yellow-500 sm:text-sm">${item.name}</p>
            </div>
        </td>
        <td class="p-4 align-middle text-end sm:py-3 sm:text-start">${item.value}</td>
        <td class="p-4 align-middle hidden text-right font-mono sm:py-4 xl:table-cell"><p>${item.date}</p></td>
      `;

      // Append the new row to the table body
      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
