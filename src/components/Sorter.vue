<script setup>
import { computed, inject, watch } from "vue";
import { useRouter } from "vue-router";

import { artists } from "@/data/artists.js";

// Accesses global sorter state and actions provided in main.js
const sorterState = inject("sorterState");
const sorterActions = inject("sorterActions");
const router = useRouter();

// Data received from the current route
const props = defineProps({
	sorter: String,
	type: String,
	album: String,
});

// Finds the current artist
const artist = computed(() => {
	return artists.find((artist) => artist.id === props.sorter);
});

// Gets the current artist's data
const currentData = computed(() => {
	return artist.value?.data;
});

// Generates the title for the sorter based on the current route
const sorterTitle = computed(() => {
	if (!currentData.value) {
		return "";
	}

	if (props.album) {
		const album = currentData.value.albums.find((a) => a.id === props.album);
		const albumName = album?.name.toUpperCase();
		return `${albumName} SONGS`;
	}

	switch (props.type) {
		case "songs":
			return `${currentData.value.title} SONGS`;

		case "albums":
			return `${currentData.value.title} ALBUMS`;

		default:
			return currentData.value.title;
	}
});

// Displays the active custom title or the title generated from the route
const displayTitle = computed(() => {
	if (props.sorter === "custom") {
		return `${sorterState.title} SORTER`;
	}

	return sorterTitle.value;
});

// Calculates progress once per render instead of calling the action twice
const progress = computed(() => sorterActions.progress());

// Gets the items that should be sorted
function getItems() {
	if (!artist.value) {
		return null;
	}

	// Sort songs from a specific album
	if (props.album) {
		const album = artist.value.data.albums.find((album) => album.id === props.album);

		return album?.songs;
	}

	// Sort all albums
	if (props.type === "albums") {
		return artist.value.data.albums.map((album) => album.name);
	}

	// Sort all songs
	return artist.value.data[props.type];
}

// Initializes the sorter when the route changes and redirects an empty custom sorter
watch(
	() => [props.sorter, props.type, props.album],
	() => {
		if (props.sorter === "custom" && sorterState.customItems.length === 0) {
			router.replace({ name: "custom" });
			return;
		}

		const items = getItems();

		if (!items) return;

		sorterActions.initSorter({
			id: artist.value.data.id,
			title: artist.value.data.title,
			items,
		});
	},
	{ immediate: true },
);

// Gets the current left item
const leftItem = computed(() => {
	const index = sorterState.lists[sorterState.currentLeftList]?.[sorterState.leftIndex];
	return sorterState.sortingItems[index];
});

// Gets the current right item
const rightItem = computed(() => {
	const index = sorterState.lists[sorterState.currentRightList]?.[sorterState.rightIndex];
	return sorterState.sortingItems[index];
});

// Sends the user's choice to the sorter
function choose(value) {
	sorterActions.choose(value);
}

// Returns to the setup form, where the current custom items and title are prefilled
function repeatCustomSorter() {
	router.push({ name: "custom" });
}
</script>

<template>
	<v-container class="fill-height">
		<!-- TITLE -->
		<v-row justify="center">
			<v-col cols="12" class="text-center">
				<h2 class="text-wrap">{{ displayTitle.toUpperCase() }}</h2>
				<p>
					Choose the option you prefer in each battle.
					<br />
					Selecting "I like both" or "No opinion" too often may affect the accuracy of your results
				</p>
			</v-col>
		</v-row>
		<!-- BATTLE -->
		<v-row justify="center">
			<v-col cols="12" class="text-center">
				<h3 v-if="!sorterState.finished">Battle #{{ sorterState.question }}</h3>
				<h3 v-else>Total number of battles: {{ sorterState.question - 1 }}</h3>
				<v-progress-linear height="30" color="blue-grey" :model-value="progress" rounded>{{ progress }}%</v-progress-linear>
			</v-col>
		</v-row>
		<!-- ITEM BUTTONS -->
		<v-row v-if="!sorterState.finished" class="sorter" justify="center">
			<v-col cols="4" class="left-col">
					<v-btn class="sorter-button full-size-btn" @click="choose(-1)">
					{{ leftItem }}
				</v-btn>
			</v-col>
			<v-col cols="4" class="center-col d-flex flex-column">
					<v-btn class="flex-grow-1 mb-2" @click="choose(0)">I like both</v-btn>
					<v-btn class="flex-grow-1" @click="choose(0)">No opinion</v-btn>
			</v-col>
			<v-col cols="4" class="right-col">
					<v-btn class="sorter-button full-size-btn" @click="choose(1)">
					{{ rightItem }}
				</v-btn>
			</v-col>
		</v-row>
		<!-- RESULTS TABLE -->
		<v-row v-else justify="center">
			<v-col cols="8" class="text-center">
				<p>Your ranking has been generated.</p>
				<v-table class="ranking-table" striped="even">
					<tbody>
						<tr v-for="item in sorterState.ranking" :key="item.position">
							<td class="text-right"># {{ item.position }}</td>
							<td class="text-center py-4">{{ item.name }}</td>
						</tr>
					</tbody>
				</v-table>
				<v-btn v-if="props.sorter === 'custom'" class="mt-4" @click="repeatCustomSorter">Repeat custom sorter</v-btn>
				<p v-else>You can start over by reloading the page.</p>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
/* Keeps table full width and lets columns size naturally */
.ranking-table table {
	width: 100%;
	table-layout: auto;
}

/* Keeps rank number on one line and aligns it right */
.ranking-table .rank-index,
.ranking-table td:first-child {
	white-space: nowrap;
	padding-right: 12px;
	text-align: right;
}

/* Small-screen: Shows left and right buttons at the top, and neutral buttons below them in a row. */
@media (max-width: 375px) {
	.sorter {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.sorter .left-col,
	.sorter .right-col {
		order: 1;
		flex: 0 0 100%;
		max-width: 100%;
	}

	.sorter .center-col {
		order: 2;
		flex: 0 0 100%;
		max-width: 100%;
		flex-direction: row;
		gap: 10px;
	}

	/* Increase touch target and weight for small screens */
	.sorter .left-col .v-btn,
	.sorter .right-col .v-btn {
		padding: 20px;
	}

	.center-col .v-btn {
		padding: 15px;
	}
}
</style>
