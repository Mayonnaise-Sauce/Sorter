<script setup>
import { computed, ref, inject, nextTick } from "vue";
import { useRouter } from "vue-router";

// Gets the router instance to navigate between pages
const router = useRouter();

// Gets the saved custom sorter data used to prefill the setup form
const sorterState = inject("sorterState");

// Stores the current input text
const input = ref("");

// Gets the reference to the input field for focusing it after adding an item
const itemInput = ref(null);

// Stores the items to sort, including items loaded from a previous custom sorter
const items = ref([...sorterState.customItems]);

// Gets the sorter actions provided by the application
const sorterActions = inject("sorterActions");

// Stores the custom sorter title, prefilled when repeating a custom sorter
const sorterTitle = ref(sorterState.customSorterTitle);

// Enables sorting only when there are enough items and a non-empty title
const canStartSorting = computed(() => {
	return items.value.length >= 2 && typeof sorterTitle.value === "string" && sorterTitle.value.trim().length > 0;
});

// Adds the current input as a new item
function addItem() {
	const value = input.value.trim();

	if (!value) return;

	items.value.push(value);
	input.value = "";

	// Focuses the input field after adding an item
	nextTick(() => itemInput.value?.focus());
}

// Removes an item from the list using its position
function removeItem(index) {
	items.value.splice(index, 1);
}

// Clears the current custom sorter so it can be created again
function deleteCustomSorter() {
	items.value = [];
	sorterTitle.value = "";
	input.value = "";
	sorterActions.clearCustomSorter();
}

// Finishes creating the custom sorter
function done() {
	if (items.value.length < 2) return;

	sorterActions.initCustomSorter(sorterTitle.value.trim(), items.value);

	router.push({ name: "customSorter" });
}
</script>

<template>
	<v-container class="fill-height">
		<!-- TITLE -->
		<v-row justify="center">
			<v-col cols="8" class="text-center">
				<h2>CUSTOM SORTER</h2>
				<p>Create your own ranking by adding the options you want to sort.<br />If you leave the page, the sorter will be cleared.</p>
			</v-col>
		</v-row>
		<!-- SORTER TITLE -->
		<v-row justify="center">
			<v-col cols="10">
				<v-text-field v-model="sorterTitle" label="Sorter title" variant="outlined" clearable hide-details />
			</v-col>
		</v-row>
		<!-- ITEM INPUT FIELD -->
		<v-row justify="center">
			<v-col cols="8">
				<v-text-field ref="itemInput" v-model="input" label="Add an item" variant="outlined" clearable hide-details @keyup.enter="addItem" />
			</v-col>
			<v-col cols="2">
				<v-btn class="full-size-btn" @click="addItem">Add</v-btn>
			</v-col>
		</v-row>
		<v-row v-if="items.length" justify="center">
			<v-col cols="8" class="d-flex align-center justify-space-between flex-wrap">
				<span v-if="items.length === 1">1 item added</span>
				<span v-else>{{ items.length }} items added</span>
				<v-btn variant="text" prepend-icon="mdi-reload" @click="deleteCustomSorter">Restart</v-btn>
			</v-col>
		</v-row>
		<!-- LIST OF ITEMS -->
		<v-row v-if="items.length" justify="center">
			<v-col cols="8">
				<v-list>
					<v-list-item class="text-wrap" v-for="(item, index) in items" :key="index">
						{{ item }}
						<template #append>
							<v-btn variant="text" icon="mdi-delete" @click="removeItem(index)"></v-btn>
						</template>
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
		<!-- DONE BUTTON -->
		<v-row justify="center">
			<v-btn :disabled="!canStartSorting" @click="done">Start sorting</v-btn>
		</v-row>
	</v-container>
</template>
