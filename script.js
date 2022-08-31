const pipe = (...arrayOfFunctions) => {
    if (arrayOfFunctions.length === 0) return null;
    else if (arrayOfFunctions.length === 1) return arrayOfFunctions[0]();
    return arrayOfFunctions.reduceRight(
        (recur, func) =>
            (...args) =>
                recur(func(...args))
    )();
};

const friendsStorageCreator = () => {
    let friendsDB = [];
    return {
        addFriends: (friends) => {
            friendsDB = friendsDB.concat(friends);
        },
        recieveFriends: () => {
            return friendsDB;
        },
        clearFriends: () => {
            friendsDB = [];
        },
    };
};
const friendsStorage = friendsStorageCreator();
let containerForFriends;
const state = {
    loading: false,
};

const friendsFilter = {
    MIN_AGE: 0,
    MAX_AGE: 200,
    sortByAge: null,
    sortByName: null,
    ageFilterRange: {},
    nameFilter: "",
    sexFilter: "all",

    reset: function () {
        this.sortByAge = null;
        this.sortByName = null;
        this.ageFilterRange = { min: this.MIN_AGE, max: this.MAX_AGE };
        this.nameFilter = "";
        this.sexFilter = "all";
    },
};
friendsFilter.reset();

const cardSize = {
    width: 200,
    height: 268,
};

const calcPagesAmount = (
    containerHeight,
    containerWidth,
    amountOfElements,
    gridGap = 10
) => {
    let columns = Math.trunc(containerWidth / cardSize.width) || 1;
    if (containerWidth % cardSize.width <= gridGap * (columns - 1)) columns--;
    let rows = Math.trunc(containerHeight / cardSize.height) || 1;
    if (containerHeight % cardSize.height <= gridGap * (rows - 1)) rows--;
    let amountPerPage = columns * rows;
    let amountOfPages = Math.ceil(amountOfElements / amountPerPage);

    return { amountPerPage, amountOfPages };
};

const getNearestIntegers = (
    currentNumber = 1,
    amountOfNumbersToReturn_odd = 1,
    totalNumbers = 1
) => {
    const centralNumber = parseInt(currentNumber);
    let amountOfNumbers = parseInt(amountOfNumbersToReturn_odd);
    if (!(amountOfNumbersToReturn_odd % 2)) amountOfNumbers -= 1;
    let numbersArr = [currentNumber];
    if (
        centralNumber === centralNumber &&
        amountOfNumbers === amountOfNumbers &&
        parseInt(totalNumbers) === parseInt(totalNumbers)
    )
        if (centralNumber - ((amountOfNumbers - 1) / 2 + 1) <= 0) {
            numbersArr = [...new Array(amountOfNumbers)].map((_, i) => i + 1);
        } else if (
            centralNumber + (amountOfNumbers - 1) / 2 + 1 >
            totalNumbers
        ) {
            numbersArr = [...new Array(totalNumbers)]
                .map((_, i) => i + 1)
                .filter((elem) => elem >= totalNumbers - amountOfNumbers + 1);
        } else {
            for (let i = Math.trunc((amountOfNumbers - 1) / 2); i >= 1; i--) {
                numbersArr.push(centralNumber - i);
                numbersArr.push(centralNumber + i);
            }
        }
    return numbersArr.sort((a, b) => a - b);
};

const createAndShowPage = (
    pageNumber,
    amountOfFriends,
    totalPages = 1,
    filteredStorage
) => {
    const showPaginationLablesAndDots = (container) => {
        const lablesToShow = createLablesToShow(container, 9, pageNumber);
        container.querySelectorAll(".radio-nav-label").forEach((labelNode) => {
            if (lablesToShow.pageNumberArr.includes(+labelNode.textContent))
                labelNode.classList.remove("hidden-page-number");
        });
        if (
            container.querySelector(".radio-nav-label:first-of-type") !== null
        ) {
            container
                .querySelector(".radio-nav-label:first-of-type")
                .classList.remove("hidden-page-number");
            container
                .querySelector(".radio-nav-label:last-of-type")
                .classList.remove("hidden-page-number");
        }
        if (container.querySelectorAll(`.radio-nav-label`).length > 9) {
            if (lablesToShow.dotsFlags.left)
                container
                    .querySelector(".left-dots")
                    .classList.remove("hidden");
            if (lablesToShow.dotsFlags.right)
                container
                    .querySelector(".right-dots")
                    .classList.remove("hidden");
        }
    };

    const createLablesToShow = (
        navContainer,
        totalNumbers = 5,
        currentNumber
    ) => {
        const amountOfRadioLabels =
            navContainer.querySelectorAll(".radio-nav-label").length;
        let dotsFlags = { left: false, right: false };
        const pageNumberArr = getNearestIntegers(
            currentNumber,
            totalNumbers,
            amountOfRadioLabels
        );

        if (pageNumberArr.length + 1 !== amountOfRadioLabels)
            if (pageNumberArr[0] === 1 || pageNumberArr[0] === 2) {
                dotsFlags.right = true;
            } else if (
                pageNumberArr[pageNumberArr.length - 1] ===
                    amountOfRadioLabels ||
                pageNumberArr[pageNumberArr.length - 1] ===
                    amountOfRadioLabels - 1
            )
                dotsFlags.left = true;
            else if (totalNumbers < amountOfRadioLabels - 2)
                dotsFlags = { left: true, right: true };

        return { pageNumberArr, dotsFlags };
    };

    const createPagesNavigation = () => {
        const createContainer = () => {
            const radioContainerNode = document.createElement("div");
            radioContainerNode.classList.add("radio-nav-container");
            return radioContainerNode;
        };

        const addLabels = (container) => {
            container.append(
                ...[...new Array(totalPages)]
                    .map((_) => document.createElement("label"))
                    .map((labelNode, i) => {
                        labelNode.setAttribute("for", `radio-${i + 1}`);
                        labelNode.classList.add(
                            `radio-nav-label`,
                            "hidden-page-number"
                        );
                        if (i + 1 === pageNumber)
                            labelNode.classList.add("checked");
                        labelNode.innerText = i + 1;
                        return labelNode;
                    })
            );
            return container;
        };

        const addThreeDots = (container) => {
            const dots = {
                left: document.createElement("span"),
                right: document.createElement("span"),
            };
            for (key in dots) {
                dots[key].textContent = "...";
                dots[key].classList.add("pagination-dots", "hidden");
            }
            dots.left.classList.add("left-dots");
            dots.right.classList.add("right-dots");
            container.insertBefore(dots.left, container.childNodes[1]);
            container.insertBefore(
                dots.right,
                container.childNodes[container.childNodes.length - 1]
            );
            return container;
        };

        const addInputs = (container) => {
            container.append(
                ...[...new Array(totalPages)].map((_, i) => {
                    const inputNode = document.createElement("input");
                    inputNode.setAttribute("type", "radio");
                    inputNode.setAttribute("name", "page-nav");
                    inputNode.setAttribute("id", `radio-${i + 1}`);
                    inputNode.classList.add("radio-nav-input");
                    return inputNode;
                })
            );
            return container;
        };

        const addEvent = (container) => {
            container.addEventListener("click", ({ target }) => {
                if (target.matches(".radio-nav-input")) {
                    const togglePaginationLabel = () => {
                        document
                            .querySelectorAll(`.radio-nav-label`)
                            .forEach((node) =>
                                node.classList.remove("checked")
                            );
                        document
                            .querySelector(`[for=${target.getAttribute("id")}]`)
                            .classList.add("checked");
                    };

                    togglePaginationLabel();
                    showPaginationLablesAndDots(
                        target.closest('[class*="container"]')
                    );

                    updateContentAccordingToActiveFilters(
                        +target.getAttribute("id").slice(6)
                    );
                }
            });
            return container;
        };

        const setCheckedFirstRadio = (container) => {
            if (container.querySelector(`input:first-of-type`) !== null)
                container.querySelector(`input:first-of-type`).checked = true;
            showPaginationLablesAndDots(container);

            return container;
        };

        return pipe(
            createContainer,
            addLabels,
            addThreeDots,
            addInputs,
            addEvent,
            setCheckedFirstRadio
        );
    };

    const createFragmentFromFriends = () => {
        const fragment = document.createDocumentFragment();
        fragment.append(
            ...filteredStorage
                .slice(
                    amountOfFriends * (pageNumber - 1),
                    amountOfFriends * pageNumber
                )
                .map((friendCard,i,arr) => createFriendCard(friendCard))
        );
        return fragment;
    };

    containerForFriends.innerHTML = "";
    const fragment = createFragmentFromFriends();
    containerForFriends.appendChild(fragment);
    if (document.querySelector(".radio-nav-container"))
        document
            .querySelector(".radio-nav-container")
            .replaceWith(createPagesNavigation(totalPages));
    else {
        document
            .querySelector(".main")
            .appendChild(createPagesNavigation(totalPages));
    }

    setTimeout(() => {
        containerForFriends.childNodes.forEach((friendToShow) =>
            friendToShow.classList.remove("hidden")
        );
    }, 0);
};

const doRecursiveFetch = (url, attempts) => {
    if (attempts === 0) return;
    return fetch(url)
        .then((response) => {
            if (response.ok) return response.json();
        })
        .catch((_) => {
            return doRecursiveFetch(url, attempts - 1);
        });
};

const downloadFriends = ({
    pages = 5,
    seed = "google",
    friendsPerPage = 10,
}) => {
    const friendFieldsList = [
        "name",
        "dob",
        "email",
        "cell",
        "id",
        "gender",
        "picture",
    ];
    let loadingProgressDots = [];

    const placeLoadingIndicator = () => {
        const loadingContainer = document.createElement("div");
        loadingContainer.classList.add("loading-container");
        const loadingText = document.createElement("span");
        loadingText.classList.add("loading-text");
        loadingText.insertAdjacentText("afterbegin", "Loading");
        loadingProgressDots = [...new Array(pages)].map((_, i) => {
            const dot = document.createElement("div");
            dot.classList.add("in-progress", "loading-dot");
            return dot;
        });
        loadingContainer.append(loadingText, ...loadingProgressDots);
        containerForFriends.appendChild(loadingContainer);
    };

    placeLoadingIndicator();
    state.loading = true;
    friendsStorage.clearFriends();

    Promise.all(
        [...new Array(pages)].map((_, i) => {
            return doRecursiveFetch(
                `https://randomuser.me/api/?inc=${friendFieldsList}&seed=${seed}&page=${
                    i + 1
                }&results=${friendsPerPage}`
            ).then((response) => {
                loadingProgressDots[i].classList.remove("in-progress");
                friendsStorage.addFriends(response.results);
            });
        })
    ).then(() => {
        state.loading = false;
        updateContentAccordingToActiveFilters();
    });
};

let createFriendCard = (friend) => {
    const createFriendContainer = () => {
        const friendCard = document.createElement("div");
        friendCard.classList.add("friend-container", "hidden");

        return friendCard;
    };

    const addName = (friendCard) => {
        const friendName = document.createElement("span");
        friendName.classList.add("name");
        friendName.textContent = `${friend.name.title}. ${friend.name.first} ${friend.name.last}`;
        friendCard.appendChild(friendName);
        return friendCard;
    };

    const addPortrait = (friendCard) => {
        const friendPortrait = document.createElement("img");
        friendPortrait.setAttribute("src", friend.picture.large);
        friendPortrait.setAttribute("alt", "random friend");
        friendPortrait.classList.add("portrait");
        friendCard.appendChild(friendPortrait);
        return friendCard;
    };

    const addDOB = (friendCard) => {
        const friendDOB = document.createElement("span");
        friendDOB.textContent = `I am ${friend.dob.age} years old.`;
        friendCard.appendChild(friendDOB);
        return friendCard;
    };

    const addEmail = (friendCard) => {
        const friendEmail = document.createElement("span");
        friendEmail.textContent = friend.email;
        friendEmail.classList.add("email");
        friendCard.appendChild(friendEmail);
        return friendCard;
    };

    const addCell = (friendCard) => {
        const friendCell = document.createElement("span");
        friendCell.textContent = friend.cell;
        friendCard.appendChild(friendCell);
        return friendCard;
    };

    const addGender = (friendCard) => {
        const friendGender = document.createElement("span");
        friendGender.textContent = friend.gender.toUpperCase();
        friendCard.appendChild(friendGender);
        return friendCard;
    };

    return pipe(
        createFriendContainer,
        addName,
        addPortrait,
        addDOB,
        addEmail,
        addCell,
        addGender
    );
};

const getFilteredStorage = (filter = friendsFilter) => {
    let filteredfriendsStorage = friendsStorage.recieveFriends();
    if (filter.ageFilterRange.max - filter.ageFilterRange.min >= 0)
        filteredfriendsStorage = filteredfriendsStorage.filter(
            (friend) =>
                friend.dob.age >= filter.ageFilterRange.min &&
                friend.dob.age <= filter.ageFilterRange.max
        );
    if (filter.nameFilter !== "")
        filteredfriendsStorage = filteredfriendsStorage.filter((friend) =>
            `${friend.name.first} ${friend.name.last}`
                .toUpperCase()
                .includes(filter.nameFilter.toUpperCase())
        );
    if (filter.sexFilter != "all") {
        filteredfriendsStorage = filteredfriendsStorage.filter(
            (friend) => friend.gender === filter.sexFilter
        );
    }
    if (filter.sortByAge != null) {
        if (filter.sortByAge === "ascending")
            filteredfriendsStorage.sort(
                (friend1, friend2) => friend1.dob.age - friend2.dob.age
            );
        if (filter.sortByAge === "descending")
            filteredfriendsStorage.sort(
                (friend1, friend2) => friend2.dob.age - friend1.dob.age
            );
    }
    if (filter.sortByName != null) {
        if (filter.sortByName === "ascending")
            filteredfriendsStorage.sort((friend1, friend2) => {
                return `${friend1.name.first} ${friend1.name.last}` >
                    `${friend2.name.first} ${friend2.name.last}`
                    ? 1
                    : -1;
            });
        if (filter.sortByName === "descending")
            filteredfriendsStorage.sort((friend1, friend2) => {
                return `${friend1.name.first} ${friend1.name.last}` <
                    `${friend2.name.first} ${friend2.name.last}`
                    ? 1
                    : -1;
            });
    }

    return filteredfriendsStorage;
};

const updateContentAccordingToActiveFilters = (pageNumber = 1) => {
    if (state.loading) return undefined;
    const filteredfriendsStorage = getFilteredStorage();
    const { amountPerPage: amountOfFriendsPerPage, amountOfPages: totalPages } =
        calcPagesAmount(
            containerForFriends.clientHeight,
            containerForFriends.clientWidth,
            filteredfriendsStorage.length
        );
    createAndShowPage(
        pageNumber,
        amountOfFriendsPerPage,
        totalPages,
        filteredfriendsStorage
    );
};

const addEventListeners = () => {
    document
        .querySelector(".sort-menu")
        .addEventListener("click", ({ target }) => {
            if (target.matches(".sort-menu-button")) {
                document
                    .querySelectorAll(".sort-menu-button")
                    .forEach((buttonNode) =>
                        buttonNode.classList.remove("selected")
                    );
                target.classList.add("selected");
            }
        });
    document.querySelector("#confirm").addEventListener("click", (event) => {
        document.querySelector("#burger-checkbox").checked = false;
    });
    document.querySelector("#name-input").addEventListener("input", (event) => {
        if (
            event.target.value &&
            !event.target.value[event.target.value.length - 1].match(/[\w\D ]/)
        )
            event.target.value = event.target.value.slice(0, -1);
        friendsFilter.nameFilter = document.querySelector("#name-input").value;
        updateContentAccordingToActiveFilters();
    });

    document
        .querySelector(".age-filter-container")
        .addEventListener("input", ({ target }) => {
            if (target.matches(".age-input")) {
                if (target.getAttribute("id") === "start-age")
                    friendsFilter.ageFilterRange.min = target.value
                        ? +target.value
                        : friendsFilter.MIN_AGE;
                else if (target.getAttribute("id") === "end-age")
                    friendsFilter.ageFilterRange.max = target.value
                        ? +target.value
                        : friendsFilter.MAX_AGE;
                updateContentAccordingToActiveFilters();
            }
        });

    document
        .querySelector(".controls-layout-container")
        .addEventListener("click", (event) => {
            if (event.target.matches("button")) event.preventDefault();

            const id = event.target.getAttribute("id");
            if (id === "age-ascending")
                (friendsFilter.sortByAge = "ascending"),
                    (friendsFilter.sortByName = null);
            else if (id === "age-descending")
                (friendsFilter.sortByAge = "descending"),
                    (friendsFilter.sortByName = null);
            else if (id === "name-ascending")
                (friendsFilter.sortByName = "ascending"),
                    (friendsFilter.sortByAge = null);
            else if (id === "name-descending")
                (friendsFilter.sortByName = "descending"),
                    (friendsFilter.sortByAge = null);
            else if (["all", "male", "female"].includes(id)) {
                friendsFilter.sexFilter = id;
                updateContentAccordingToActiveFilters();
            } else if (id === "reset") {
                friendsFilter.reset(),
                    document
                        .querySelectorAll(".selected")
                        .classList.remove("selected");
                document.querySelector("#start-age").value = "";
                document.querySelector("#end-age").value = "";
                document.querySelector("#name-input").value = "";
                document.querySelector("#all").checked = true;
            }

            if (event.target.matches("button"))
                updateContentAccordingToActiveFilters();
        });
    window.addEventListener("resize", resizeThrottler, false);
};

const resizeThrottler = (() => {
    let resizeTimeout;
    return () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                updateContentAccordingToActiveFilters();
            }, 66);
        }
    };
})();

document.addEventListener("DOMContentLoaded", (event) => {
    addEventListeners();
    containerForFriends = document.querySelector(".friends-container");
    downloadFriends({});
});

