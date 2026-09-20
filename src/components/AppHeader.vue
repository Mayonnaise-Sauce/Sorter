<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import customIcon from "@/assets/icons/custom.png";

defineProps({
	artists: {
		type: Array,
		required: true,
	},
});

// Navigation drawer state
const drawer = ref(false);

const router = useRouter();

// Returns to the previous page
function goBack() {
	if (window.history.state?.back) {
		router.back();
		return;
	}

	router.push({ path: "/" });
}
</script>

<template>
	<v-app-bar density="comfortable">
		<v-app-bar-nav-icon @click="drawer = !drawer" />
		<v-btn icon="mdi-arrow-left" aria-label="Go back" @click="goBack" />
		<v-toolbar-title>Sorter</v-toolbar-title>
		<v-btn icon="mdi-home" to="/" />
	</v-app-bar>
	<v-navigation-drawer v-model="drawer">
		<v-list density="comfortable" nav>
			<v-list-group class="mb-4" v-for="artist in artists" :key="artist.id">
				<template #activator="{ props }">
					<v-list-item v-bind="props">
						<template #prepend>
							<v-avatar>
								<v-img :src="artist.icon" />
							</v-avatar>
						</template>
						<span class="text-wrap">{{ artist.name }}</span>
					</v-list-item>
				</template>
				<v-list-item title="Songs" prepend-icon="mdi-music" :to="`/${artist.id}/songs`" />
				<v-list-item title="Albums" prepend-icon="mdi-folder-music" :to="`/${artist.id}/albums`" />
				<v-divider class="my-2" />
				<v-list-item v-for="album in artist.data.albums" :key="album.id" :title="album.name" :to="`/${artist.id}/albums/${album.id}`">
					<template #prepend>
						<v-avatar>
							<v-img :src="album.icon" :alt="album.name" />
						</v-avatar>
					</template>
				</v-list-item>
			</v-list-group>
			<v-divider class="my-2" />
			<v-list-item title="Custom Sorter" to="/custom">
				<template #prepend>
					<v-avatar>
						<v-img :src="customIcon" />
					</v-avatar>
				</template>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>
