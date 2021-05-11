document.addEventListener("DOMContentLoaded", (event) => {
	const userStorageCreator = () => {
		let userDB = []
		return {
			addUser: (user) => {
				userDB.push(user)
			},
			getUsers: () => {
				return userDB.slice()
			},
			clearUsers: () => {
				userDB = []
			},
		}
	}
	const userStorage = userStorageCreator()

	const filterCreator = () => {
		let sortByAge = undefined
		let sortByName = undefined
		let ageFilterRange = []
		let nameFilter = ""
		let sexFilter = "all"
		return {
			setSortByAge: (param) => (sortByAge = param),
			getSortByAge: () => sortByAge,
			setSortByName: (param) => (sortByName = param),
			getSortByName: () => sortByName,
			setAgeFilterRange: (param) => (ageFilterRange = param),
			getAgeFilterRange: () => ageFilterRange,
			setNameFilter: (param) => (nameFilter = param),
			getNameFilter: () => nameFilter,
			setSexFilter: (param) => (sexFilter = param),
			getSexFilter: () => sexFilter,
			reset: () => {
				sortByAge = undefined
				sortByName = undefined
				ageFilterRange = []
				nameFilter = ""
				sexFilter = "all"
			},
		}
	}
	const userFilter = filterCreator()
	const compose = (...arrayOfFunctions) => {
		return arrayOfFunctions.reduce((prev, func) => {
			return func(prev)
		}, undefined)
	}
	const showPage = (pageNumber, amountOfFriends, totalPages = 1, filteredStorage) => {
		const createPagesNavigation = () => {
			const createContainer = () => {
				let radioContainerNode = document.createElement("div")
				radioContainerNode.classList.add("radio-nav-container")
				return radioContainerNode
			}
			const addLabels = (container) => {
				let labelArr = new Array(totalPages).fill(undefined)
				labelArr = labelArr
					.map((none) => document.createElement("label"))
					.map((labelNode, i) => {
						labelNode.setAttribute("for", `radio-${i + 1}`)
						labelNode.classList.add(`radio-nav-label`)

						if (i + 1 === pageNumber) labelNode.classList.add("checked")
						labelNode.innerText = i + 1
						return labelNode
					})
					.forEach((labelNode) => container.appendChild(labelNode))
				return container
			}
			const addInputs = (container) => {
				let radioArr = new Array(totalPages).fill(undefined)
				radioArr = radioArr
					.map((none) => document.createElement("input"))
					.map((inputNode, i) => {
						inputNode.setAttribute("type", "radio")
						inputNode.setAttribute("name", "page-nav")
						inputNode.setAttribute("id", `radio-${i + 1}`)
						inputNode.classList.add("radio-nav-input")
						return inputNode
					})
					.forEach((radioNode) => container.appendChild(radioNode))
				return container
			}
			const addEvent = (container) => {
				container.addEventListener("click", ({ target }) => {
					if (target.matches(".radio-nav-input")) {
						document
							.querySelectorAll(`.radio-nav-label`)
							.forEach((node) => node.classList.remove("checked"))
						document
							.querySelector(`[for=${target.getAttribute("id")}]`)
							.classList.add("checked")
						updateContentAccordingToActiveFilters(+target.getAttribute("id").slice(6))
					}
				})
				return container
			}
			return compose(createContainer, addLabels, addInputs, addEvent)
		}
		const createFragmentFromUsers = () => {
			let fragment = document.createDocumentFragment()
			filteredStorage
				.slice(amountOfFriends * (pageNumber - 1), amountOfFriends * pageNumber)
				.forEach((userCard) => fragment.appendChild(createFriendCard(userCard)))
			return fragment
		}
		document.querySelector(".friends-container").innerHTML = ""
		let fragment = createFragmentFromUsers()
		document.querySelector(".friends-container").appendChild(fragment)

		if (document.querySelector(".radio-nav-container"))
			document
				.querySelector(".radio-nav-container")
				.replaceWith(createPagesNavigation(totalPages))
		else document.querySelector(".main").appendChild(createPagesNavigation(totalPages))

		setTimeout(() => {
			document
				.querySelector(".friends-container")
				.childNodes.forEach((friendToShow) => friendToShow.classList.remove("hidden"))
		}, 0)
	}

	const getUserData = async (url = "https://randomuser.me/api/") => {
		let response = await fetch(url)
		if (response.ok) {
			let json = await response.json()
			return json
		} else {
			return response.status
		}
	}
	const downloadUsers = async ({ page = 1, seed = "google", result = 1 }) => {
		const userFieldsList = ["name", "dob", "email", "cell", "id", "gender", "picture"]

		userStorage.clearUsers()

		for (let i = 1; i <= page; i++) {
			let users = await getUserData(
				`https://randomuser.me/api/?inc=${userFieldsList}&seed=${seed}&page=${i}&results=${result}`
			)
			users.results.forEach((user) => userStorage.addUser(user))
		}
	}

	const createFriendCard = (user) => {
		const createFriendContainer = () => {
			let friend = document.createElement("div")
			friend.classList.add("friend-container", "hidden")

			return friend
		}
		const addName = (friend) => {
			let friendName = document.createElement("span")
			friendName.classList.add(
				user.gender === "male" ? "friend-male-name" : "friend-female-name"
			)
			friendName.textContent = `${user.name.title}. ${user.name.first} ${user.name.last}`
			friend.appendChild(friendName)
			return friend
		}
		const addPortrait = (friend) => {
			let friendPortrait = document.createElement("img")
			friendPortrait.setAttribute("src", user.picture.large)
			friendPortrait.setAttribute("alt", "random user")
			friend.appendChild(friendPortrait)
			return friend
		}
		const addDOB = (friend) => {
			let friendDOB = document.createElement("span")
			friendDOB.textContent = `I am ${user.dob.age} years old.`
			friend.appendChild(friendDOB)
			return friend
		}
		const addEmail = (friend) => {
			let friendEmail = document.createElement("span")
			friendEmail.textContent = user.email
			friendEmail.classList.add("email")
			friend.appendChild(friendEmail)
			return friend
		}
		const addCell = (friend) => {
			let friendCell = document.createElement("span")
			friendCell.textContent = user.cell
			friend.appendChild(friendCell)
			return friend
		}
		const addNick = (friend) => {
			let friendNick = document.createElement("span")
			friendNick.textContent = user.id.name === "" ? "no id" : user.id.name
			friend.appendChild(friendNick)
			return friend
		}
		const addGender = (friend) => {
			let friendGender = document.createElement("span")
			friendGender.textContent = user.gender.toUpperCase()
			friend.appendChild(friendGender)
			return friend
		}
		return compose(
			createFriendContainer,
			addName,
			addPortrait,
			addDOB,
			addEmail,
			addCell,
			addNick,
			addGender
		)
	}

	const getFilteredStorage = (filter = userFilter) => {
		let filteredUserStorage = userStorage.getUsers()
		if (filter.getAgeFilterRange().length !== 0)
			filteredUserStorage = filteredUserStorage.filter(
				(user) =>
					user.dob.age >= filter.getAgeFilterRange()[0] &&
					user.dob.age <= filter.getAgeFilterRange()[1]
			)
		if (filter.getNameFilter() !== "")
			filteredUserStorage = filteredUserStorage.filter((user) =>
				`${user.name.first} ${user.name.last}`
					.toUpperCase()
					.includes(filter.getNameFilter().toUpperCase())
			)
		if (filter.getSexFilter() != "all") {
			filteredUserStorage = filteredUserStorage.filter(
				(user) => user.gender === filter.getSexFilter()
			)
		}
		if (filter.getSortByAge() != undefined) {
			if (filter.getSortByAge() === "ascending")
				filteredUserStorage.sort((user1, user2) => user1.dob.age - user2.dob.age)
			if (filter.getSortByAge() === "descending")
				filteredUserStorage.sort((user1, user2) => user2.dob.age - user1.dob.age)
		}

		if (filter.getSortByName() != undefined) {
			if (filter.getSortByName() === "ascending")
				filteredUserStorage.sort((user1, user2) => {
					return `${user1.name.first} ${user1.name.last}` >
						`${user2.name.first} ${user2.name.last}`
						? 1
						: -1
				})
			if (filter.getSortByName() === "descending")
				filteredUserStorage.sort((user1, user2) => {
					return `${user1.name.first} ${user1.name.last}` <
						`${user2.name.first} ${user2.name.last}`
						? 1
						: -1
				})
		}

		return filteredUserStorage
	}
	const updateContentAccordingToActiveFilters = (pageNumber = 1) => {
		let filteredUserStorage = getFilteredStorage()
		const calcPagesAmount = (filteredListOfFriends) => {
			let asideWidth = 210
			let columns = Math.trunc(
				(document.querySelector(".body").clientWidth - asideWidth) / 220
			)
			let rows = Math.trunc(document.querySelector(".friends-container").clientHeight / 300)

			let amountPerPage = columns * rows

			let amountOfPages = Math.ceil(filteredListOfFriends.length / amountPerPage)
			return [amountPerPage, amountOfPages]
		}
		let [amountOfFriendsPerPage, totalPages] = calcPagesAmount(filteredUserStorage)

		showPage(pageNumber, amountOfFriendsPerPage, totalPages, filteredUserStorage)
	}
	const downloadFriends = async (amountPerPage = 10) => {
		await downloadUsers({ page: 5, seed: "google", result: amountPerPage })

		updateContentAccordingToActiveFilters()
	}
	downloadFriends()

	const addEventListeners = () => {
		document.querySelector(".sort-menu").addEventListener("click", ({ target }) => {
			if (target.matches(".sort-menu-button")) {
				document
					.querySelectorAll(".sort-menu-button")
					.forEach((buttonNode) => buttonNode.classList.remove("selected"))
				target.classList.add("selected")
			}
		})

		document.querySelector("#name-input").addEventListener("keypress", (event) => {
			return (
				(event.charCode >= 65 && event.charCode <= 90) ||
				(event.charCode >= 97 && event.charCode <= 122) ||
				event.charCode === 32
			)
		})
		document.querySelector(".controls-layout-container").addEventListener("click", (event) => {
			if (event.target.matches("button")) event.preventDefault()

			let id = event.target.getAttribute("id")
			id === "age-ascending"
				? (userFilter.setSortByAge("ascending"), userFilter.setSortByName(undefined))
				: id === "age-descending"
				? (userFilter.setSortByAge("descending"), userFilter.setSortByName(undefined))
				: id === "name-ascending"
				? (userFilter.setSortByName("ascending"), userFilter.setSortByAge(undefined))
				: id === "name-descending"
				? (userFilter.setSortByName("descending"), userFilter.setSortByAge(undefined))
				: id === "filter-by-age"
				? userFilter.setAgeFilterRange([
						document.querySelector("#start-age").value,
						document.querySelector("#end-age").value,
				  ])
				: id === "filter-by-name"
				? userFilter.setNameFilter(document.querySelector("#name-input").value)
				: id === "filter-by-sex"
				? userFilter.setSexFilter(
						document.querySelector("[name=radiobutton-sex]:checked").getAttribute("id")
				  )
				: id === "reset"
				? (userFilter.reset(),
				  document
						.querySelectorAll(".sort-menu-button")
						.forEach((node) => node.classList.remove("selected")),
				  (document.querySelector("#start-age").value = ""),
				  (document.querySelector("#end-age").value = ""),
				  (document.querySelector("#name-input").value = ""),
				  (document.querySelector("#all").checked = true))
				: {}

			if (event.target.matches("button")) updateContentAccordingToActiveFilters()
		})
	}
	addEventListeners()
})
