const floorsEl = document.getElementById("floors");
const numFloors = 6;
const backgroundEl = document.querySelector(".background");

let backgroundImages = [
  "background/images1.jpg",
  "background/images2.jpg",
  "background/images3.jpg",
  "background/images4.jpg",
  "background/images5.jpg"
];
let bgIndex = 0;

setInterval(() => {
  bgIndex = (bgIndex + 1) % backgroundImages.length;
  backgroundEl.style.backgroundImage = `url('${backgroundImages[bgIndex]}')`;
}, 7000);

const floorConfig = [
  { room: "01", beds: 1 },
  { room: "02", beds: 2 },
  ...Array.from({ length: 5 }, (_, i) => ({ room: String(3 + i).padStart(2, '0'), beds: 4 })),
  ...Array.from({ length: 5 }, (_, i) => ({ room: String(8 + i).padStart(2, '0'), beds: 3 })),
  { room: "13", beds: 2 },
];

let hostelData = JSON.parse(localStorage.getItem("hostelData") || "{}");

function saveData() {
  localStorage.setItem("hostelData", JSON.stringify(hostelData));
}

function render() {
  floorsEl.innerHTML = "";
  for (let floor = 1; floor <= numFloors; floor++) {
    const floorDiv = document.createElement("div");
    floorDiv.className = "floor";
    const title = document.createElement("h3");
    title.textContent = `Floor ${floor}`;
    floorDiv.appendChild(title);

    floorConfig.forEach(({ room, beds }) => {
      const fullRoomNumber = `${floor}${room}`;
      const roomKey = `${floor}-${room}`;
      const roomData = hostelData[roomKey] || [];

      const roomDiv = document.createElement("div");
      roomDiv.className = "room";

      const roomTitle = document.createElement("div");
      roomTitle.className = "room-title";
      roomTitle.textContent = `Room ${fullRoomNumber}`;
      roomDiv.appendChild(roomTitle);

      for (let i = 0; i < beds; i++) {
        const guestDiv = document.createElement("div");
        guestDiv.className = "guest-inputs";

        // Per-bed color status
        if (roomData[i]) {
          if (roomData[i].vacateDate) {
            guestDiv.classList.add("vacating");
          } else {
            guestDiv.classList.add("occupied");
          }
        } else {
          guestDiv.classList.add("available");
        }

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Name";
        input.value = roomData[i]?.name || "";
        input.onchange = () => {
          if (!hostelData[roomKey]) hostelData[roomKey] = [];
          hostelData[roomKey][i] = hostelData[roomKey][i] || {};
          hostelData[roomKey][i].name = input.value;
          saveData();
          render();
        };

        const joinDate = document.createElement("input");
        joinDate.type = "date";
        joinDate.value = roomData[i]?.joinDate || "";
        joinDate.onchange = () => {
          if (!hostelData[roomKey]) hostelData[roomKey] = [];
          hostelData[roomKey][i] = hostelData[roomKey][i] || {};
          hostelData[roomKey][i].joinDate = joinDate.value;
          saveData();
        };

        const vacateDate = document.createElement("input");
        vacateDate.type = "date";
        vacateDate.value = roomData[i]?.vacateDate || "";
        vacateDate.onchange = () => {
          if (!hostelData[roomKey]) hostelData[roomKey] = [];
          hostelData[roomKey][i] = hostelData[roomKey][i] || {};
          hostelData[roomKey][i].vacateDate = vacateDate.value;
          saveData();
          render();
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.onclick = () => {
          hostelData[roomKey].splice(i, 1);
          if (hostelData[roomKey].length === 0) delete hostelData[roomKey];
          saveData();
          render();
        };

        guestDiv.appendChild(input);
        guestDiv.appendChild(joinDate);
        guestDiv.appendChild(vacateDate);
        guestDiv.appendChild(delBtn);
        roomDiv.appendChild(guestDiv);
      }

      floorDiv.appendChild(roomDiv);
    });

    floorsEl.appendChild(floorDiv);
  }
}

render();
