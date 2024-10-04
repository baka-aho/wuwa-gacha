const buttons = document.querySelectorAll(
  'button[aria-label="Filter by rarity 4"]'
);

// Check if the second button exists and update its class
if (buttons.length > 1) {
  buttons[1].className =
    "inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-7 gap-1 text-sm font-semibold";
}

var elements = document.querySelectorAll(
  "div.flex.w-full.flex-1.items-center.justify-between.gap-2.text-center p.text-xl.font-bold"
);

var currentPity = 5;
let totalPulls = 0;

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
    const characters = data.characters;
    const container = document.querySelector(".p-6.grid.gap-x-4.gap-y-2");

    // Clear container
    container.innerHTML = "";

    // Initialize total pulls
    characters.forEach((character) => {
      totalPulls += character.value;

      // Create character div
      const characterDiv = document.createElement("div");
      characterDiv.className = "relative h-16 w-16 place-self-center";

      // Create image container and image
      const imgContainer = document.createElement("div");
      imgContainer.className =
        "h-16 w-16 overflow-hidden rounded-full bg-muted/50";

      const img = document.createElement("img");
      img.alt = character.name;
      img.loading = "lazy";
      img.width = 404;
      img.height = 560;
      img.src = character.image;
      img.style.color = "transparent";

      imgContainer.appendChild(img);
      characterDiv.appendChild(imgContainer);

      // Create badge
      const badge = document.createElement("div");
      badge.className = "";

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

    // Update statistics if elements length is correct
    if (elements.length === 4) {
      totalPulls += currentPity;
      var astrites = totalPulls * 160;
      var fourStars = Math.ceil(totalPulls / 10 + 13);
      var fiveStars = characters.length;

      elements[0].textContent = totalPulls.toLocaleString();
      elements[1].textContent = astrites.toLocaleString();
      elements[2].textContent = fourStars.toLocaleString();
      elements[3].textContent = fiveStars.toLocaleString();
    } else {
      console.error("Expected 4 elements but found:", elements.length);
    }

    // Calculate win/lose statistics
    let accumulatedPullNo = 0;
    let guaranteed = false;
    let win = 0;
    let lose = 0;

    for (let i = characters.length - 1; i >= 0; i--) {
      const notLimited = [
        "Verina",
        "Lingyang",
        "Calcharo",
        "Encore",
        "Jianxin",
      ];
      if (guaranteed) {
        if (!notLimited.includes(characters[i].name)) {
          guaranteed = false;
        }
      } else {
        if (!notLimited.includes(characters[i].name)) {
          win++;
          guaranteed = false;
        } else {
          lose++;
          guaranteed = true;
        }
      }
      accumulatedPullNo += characters[i].value;
      characters[i].pullno = accumulatedPullNo;
    }

    // Update statistics
    function updateStatistic(label, value) {
      const statisticElement = Array.from(
        document.querySelectorAll(
          ".flex.cursor-help.justify-between.gap-4.text-sm"
        )
      ).find((el) =>
        el.querySelector("p.truncate").textContent.includes(label)
      );

      if (statisticElement) {
        statisticElement.querySelector("p.text-muted-foreground").textContent =
          value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + (label === "Average Pity" ? "" : "%");
      } else {
        console.error(`Statistic with label "${label}" not found.`);
      }
    }

    let averagePity = accumulatedPullNo / characters.length;

    updateStatistic("Average Pity", averagePity);
    updateStatistic("50/50 Wins", (win / lose) * 100);

    // Update table with character data
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

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

      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
