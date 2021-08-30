document.addEventListener("DOMContentLoaded", (event) => {
	let userStorageCreator = () => {
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
	let filterCreator = () => {
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
	let cardSizeCreator = () => {
		let width = 216
		let height = 268
		return {
			getWidth: () => width,
			getHeight: () => height,
		}
	}
	let pipe = (...arrayOfFunctions) => {
		/*return arrayOfFunctions.reduce((prev, func) => {
			return func(prev)
		}, undefined) */
		if (arrayOfFunctions.length === 0) return undefined
		else if (arrayOfFunctions.length === 1) return arrayOfFunctions[0]()
		return arrayOfFunctions.reduceRight((recur, func) => (...args) => recur(func(...args)))()
	}
	let calcPagesAmount = (
		containerHeight,
		containerWidth,
		width = 210,
		height = 300,
		amountOfElements
	) => {
		let columns = Math.trunc(containerWidth / width) || 1
		let rows = Math.trunc(containerHeight / height) || 1
		let amountPerPage = columns * rows
		let amountOfPages = Math.ceil(amountOfElements / amountPerPage)
		return [amountPerPage, amountOfPages]
	}
	let getNearestIntegers = (
		currentNumber = 1,
		amountOfNumbersToReturn_odd = 1,
		totalNumbers = 1
	) => {
		let centralNumber = parseInt(currentNumber)
		let amountOfNumbers = parseInt(amountOfNumbersToReturn_odd)
		if (!(amountOfNumbersToReturn_odd % 2)) amountOfNumbers -= 1
		let numbersArr = [currentNumber]
		if (
			!(centralNumber === centralNumber) ||
			!(amountOfNumbers === amountOfNumbers) ||
			!(parseInt(totalNumbers) === parseInt(totalNumbers))
		)
			console.log("NaN in getNearestIntegers")

		if (centralNumber - ((amountOfNumbers - 1) / 2 + 1) <= 0) {
			numbersArr = new Array(amountOfNumbers).fill(undefined).map((elem, i) => i + 1)
		} else if (centralNumber + (amountOfNumbers - 1) / 2 + 1 > totalNumbers) {
			numbersArr = new Array(totalNumbers)
				.fill(undefined)
				.map((elem, i) => i + 1)
				.filter((elem) => elem >= totalNumbers - amountOfNumbers + 1)
		} else {
			for (let i = Math.trunc((amountOfNumbers - 1) / 2); i >= 1; i--) {
				numbersArr.push(centralNumber - i)
				numbersArr.push(centralNumber + i)
			}
		}
		return numbersArr.sort((a, b) => a - b)
	}
	let logCallWrapper = (func) => {
		return (...args) => {
			console.log(`call: ${func.name}`)
			let result = func(...args)
			console.log(`return: ${func.name}`)
			console.log(`result: ${result}`)
			return result
		}
	}
	//pipe = logCallWrapper(pipe)

	let userStorage = userStorageCreator()
	let userFilter = filterCreator()
	let cardSize = cardSizeCreator()

	let createAndShowPage = (pageNumber, amountOfFriends, totalPages = 1, filteredStorage) => {
		let showPaginationLablesAndDots = (container) => {
			let lablesToShow = getLablesToShow(container, 9, pageNumber)
			container.querySelectorAll(".radio-nav-label").forEach((labelNode) => {
				if (lablesToShow[0].includes(+labelNode.textContent))
					labelNode.classList.remove("hidden-page-number")
			})
			container
				.querySelector(".radio-nav-label:first-of-type")
				.classList.remove("hidden-page-number")
			container
				.querySelector(".radio-nav-label:last-of-type")
				.classList.remove("hidden-page-number")
			if (container.querySelectorAll(`.radio-nav-label`).length > 9) {
				if (lablesToShow[1][0])
					container.querySelector(".left-dots").classList.remove("hidden")
				if (lablesToShow[1][1])
					container.querySelector(".right-dots").classList.remove("hidden")
			}
		}
		showPaginationLablesAndDots = logCallWrapper(showPaginationLablesAndDots)
		let getLablesToShow = (navContainer, totalNumbers = 5, currentNumber) => {
			let amountOfRadioLabels = navContainer.querySelectorAll(".radio-nav-label").length
			let dotsFlags = [false, false]
			let pageNumberArr = getNearestIntegers(currentNumber, totalNumbers, amountOfRadioLabels)
			if (pageNumberArr.length + 1 !== amountOfRadioLabels)
				if (pageNumberArr[0] === 1 || pageNumberArr[0] === 2) {
					dotsFlags[1] = true
				} else if (
					pageNumberArr[pageNumberArr.length - 1] === amountOfRadioLabels ||
					pageNumberArr[pageNumberArr.length - 1] === amountOfRadioLabels - 1
				)
					dotsFlags[0] = true
				else if (totalNumbers < amountOfRadioLabels - 2) dotsFlags = [true, true]

			return [pageNumberArr, dotsFlags]
		}
		let createPagesNavigation = () => {
			let createContainer = () => {
				let radioContainerNode = document.createElement("div")
				radioContainerNode.classList.add("radio-nav-container")
				return radioContainerNode
			}
			let addLabels = (container) => {
				let labelArr = new Array(totalPages).fill(undefined)
				labelArr = labelArr
					.map((none) => document.createElement("label"))
					.map((labelNode, i) => {
						labelNode.setAttribute("for", `radio-${i + 1}`)
						labelNode.classList.add(`radio-nav-label`, "hidden-page-number")

						if (i + 1 === pageNumber) labelNode.classList.add("checked")
						labelNode.innerText = i + 1
						return labelNode
					})
					.forEach((labelNode) => container.appendChild(labelNode))
				return container
			}
			let addThreeDots = (container) => {
				let dots = [document.createElement("span"), document.createElement("span")]
				dots.forEach((node) => {
					node.textContent = "..."
					node.classList.add("pagination-dots", "hidden")
				})
				dots[0].classList.add("left-dots")
				dots[1].classList.add("right-dots")
				container.insertBefore(dots[0], container.childNodes[1])
				container.insertBefore(
					dots[1],
					container.childNodes[container.childNodes.length - 1]
				)
				return container
			}
			let addInputs = (container) => {
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
			let addEvent = (container) => {
				container.addEventListener("click", ({ target }) => {
					if (target.matches(".radio-nav-input")) {
						let togglePaginationLabel = () => {
							document
								.querySelectorAll(`.radio-nav-label`)
								.forEach((node) => node.classList.remove("checked"))
							document
								.querySelector(`[for=${target.getAttribute("id")}]`)
								.classList.add("checked")
						}

						togglePaginationLabel()
						showPaginationLablesAndDots(target.closest('[class*="container"]'))

						updateContentAccordingToActiveFilters(+target.getAttribute("id").slice(6))
					}
				})
				return container
			}
			let setCheckedFirstRadio = (container) => {
				//debugger
				container.querySelector(`input:first-of-type`).checked = true
				showPaginationLablesAndDots(container)

				return container
			}
			return pipe(
				createContainer,
				addLabels,
				addThreeDots,
				addInputs,
				addEvent,
				setCheckedFirstRadio
			)
		}
		let createFragmentFromUsers = () => {
			//debugger
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
		else {
			document.querySelector(".main").appendChild(createPagesNavigation(totalPages))
		}

		setTimeout(() => {
			document
				.querySelector(".friends-container")
				.childNodes.forEach((friendToShow) => friendToShow.classList.remove("hidden"))
		}, 0)
	}

	let getUserData = async (url = "https://randomuser.me/api/") => {
		let response = await fetch(url)
		if (response.ok) {
			let json = await response.json()
			return json
		} else {
			return response.status
		}
	}
	let downloadUsers = async ({ page = 1, seed = "google", result = 1 }) => {
		let userFieldsList = ["name", "dob", "email", "cell", "id", "gender", "picture"]

		userStorage.clearUsers()

		for (let i = 1; i <= page; i++) {
			let users = await getUserData(
				`https://randomuser.me/api/?inc=${userFieldsList}&seed=${seed}&page=${i}&results=${result}`
			)
			users.results.forEach((user) => userStorage.addUser(user))
		}
	}

	let createFriendCard = (user) => {
		let createFriendContainer = () => {
			let friend = document.createElement("div")
			friend.classList.add("friend-container", "hidden")

			return friend
		}
		let addName = (friend) => {
			let friendName = document.createElement("span")
			friendName.classList.add(
				user.gender === "male" ? "friend-male-name" : "friend-female-name"
			)
			friendName.textContent = `${user.name.title}. ${user.name.first} ${user.name.last}`
			friend.appendChild(friendName)
			return friend
		}
		let addPortrait = (friend) => {
			let friendPortrait = document.createElement("img")
			friendPortrait.setAttribute("src", user.picture.large)
			friendPortrait.setAttribute("alt", "random user")
			friend.appendChild(friendPortrait)
			return friend
		}
		let addDOB = (friend) => {
			let friendDOB = document.createElement("span")
			friendDOB.textContent = `I am ${user.dob.age} years old.`
			friend.appendChild(friendDOB)
			return friend
		}
		let addEmail = (friend) => {
			let friendEmail = document.createElement("span")
			friendEmail.textContent = user.email
			friendEmail.classList.add("email")
			friend.appendChild(friendEmail)
			return friend
		}
		let addCell = (friend) => {
			let friendCell = document.createElement("span")
			friendCell.textContent = user.cell
			friend.appendChild(friendCell)
			return friend
		}
		/* 		let addNick = (friend) => {
			let friendNick = document.createElement("span")
			friendNick.textContent = user.id.name === "" ? "no id" : user.id.name
			friend.appendChild(friendNick)
			return friend
		} */
		let addGender = (friend) => {
			let friendGender = document.createElement("span")
			friendGender.textContent = user.gender.toUpperCase()
			friend.appendChild(friendGender)
			return friend
		}
		return pipe(
			createFriendContainer,
			addName,
			addPortrait,
			addDOB,
			addEmail,
			addCell,
			//addNick,
			addGender
		)
	}
	//createFriendCard = logCallWrapper(createFriendCard)
	let getFilteredStorage = (filter = userFilter) => {
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
	let updateContentAccordingToActiveFilters = (pageNumber = 1) => {
		let filteredUserStorage = getFilteredStorage()

		let [amountOfFriendsPerPage, totalPages] = calcPagesAmount(
			document.querySelector(".friends-container").clientHeight,
			document.querySelector(".body").clientWidth - 210,
            //todo aside size must be considered in Media
			cardSize.getWidth(),
			cardSize.getHeight(),
			filteredUserStorage.length
		)
		createAndShowPage(pageNumber, amountOfFriendsPerPage, totalPages, filteredUserStorage)
	}
	let downloadFriends = async (amountPerPage = 10) => {
		await downloadUsers({ page: 5, seed: "google", result: amountPerPage })

		await updateContentAccordingToActiveFilters()
	}
	downloadFriends()

	let addEventListeners = () => {
		document.querySelector(".sort-menu").addEventListener("click", ({ target }) => {
			if (target.matches(".sort-menu-button")) {
				document
					.querySelectorAll(".sort-menu-button")
					.forEach((buttonNode) => buttonNode.classList.remove("selected"))
				target.classList.add("selected")
			}
		})
        document.querySelector('#confirm').addEventListener('click',(event)=>{
            document.querySelector('#burger-checkbox').checked=false
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
		;(() => {
			window.addEventListener("resize", resizeThrottler, false)

			let resizeTimeout
			function resizeThrottler() {
				if (!resizeTimeout) {
					resizeTimeout = setTimeout(function () {
						resizeTimeout = null
						actualResizeHandler()

						// The actualResizeHandler will execute at a rate of 15fps
					}, 66)
				}
			}

			function actualResizeHandler() {
				updateContentAccordingToActiveFilters()
			}
		})()
	}
	addEventListeners()
})
