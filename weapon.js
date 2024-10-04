var elements = document.querySelectorAll(
  "div.flex.w-full.flex-1.items-center.justify-between.gap-2.text-center p.text-xl.font-bold"
);

var currentPity = 5;
let totalPulls = 0;

fetch(
  "https://raw.githubusercontent.com/baka-aho/wuwa-gacha/refs/heads/main/weapon.json"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const weapons = data.weapons;
    const container = document.querySelector(".p-6.grid.gap-x-4.gap-y-2");

    // Clear container
    container.innerHTML = "";

    // Initialize total pulls
    weapons.forEach((weapon) => {
      totalPulls += weapon.value;

      // Create weapon div
      const weaponDiv = document.createElement("div");
      weaponDiv.className = "relative h-16 w-16 place-self-center";

      // Create image container and image
      const imgContainer = document.createElement("div");
      imgContainer.className =
        "h-16 w-16 overflow-hidden rounded-full bg-muted/50";

      const img = document.createElement("img");
      img.alt = weapon.name;
      img.loading = "lazy";
      img.width = 404;
      img.height = 560;
      img.src = weapon.image;
      img.style.color = "transparent";

      imgContainer.appendChild(img);
      weaponDiv.appendChild(imgContainer);

      // Create badge
      const badge = document.createElement("div");
      badge.className = "";

      if (weapon.value < 60 && weapon.value > 39) {
        badge.className =
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-700 text-white hover:bg-yellow-700/80 absolute -bottom-1 -right-1 flex aspect-square w-7 items-center justify-center";
      } else if (weapon.value > 59) {
        badge.className =
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 absolute -bottom-1 -right-1 flex aspect-square w-7 items-center justify-center";
      } else {
        badge.className =
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-700 text-white hover:bg-green-700/80 absolute -bottom-1 -right-1 flex aspect-square w-7 items-center justify-center";
      }

      badge.textContent = weapon.value;
      weaponDiv.appendChild(badge);
      container.appendChild(weaponDiv);
    });

    // Update statistics if elements length is correct
    if (elements.length === 4) {
      totalPulls += currentPity;
      var astrites = totalPulls * 160;
      var fourStars = Math.ceil(
        (totalPulls / 10) * 0.35 + (totalPulls / 10) * 0.5 * 0.5
      );
      var fiveStars = weapons.length;

      elements[0].textContent = totalPulls.toLocaleString();
      elements[1].textContent = astrites.toLocaleString();
      elements[2].textContent = fourStars.toLocaleString();
      elements[3].textContent = fiveStars.toLocaleString();
    } else {
      console.error("Expected 4 elements but found:", elements.length);
    }

    // Calculate win/lose statistics
    let accumulatedPullNo = 0;

    for (let i = weapons.length - 1; i >= 0; i--) {
      accumulatedPullNo += weapons[i].value;
      weapons[i].pullno = accumulatedPullNo;
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
          });
      } else {
        console.error(`Statistic with label "${label}" not found.`);
      }
    }

    let averagePity = accumulatedPullNo / weapons.length;

    updateStatistic("Average Pity", averagePity);

    // Update table with weapon data
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    weapons.forEach((item) => {
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
