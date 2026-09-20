import galeraIcon from "@/assets/icons/galera/galera.jpg";
import tylaTrankoIcon from "@/assets/icons/galera/tyla_tranko.jpg";
import garsuIcon from "@/assets/icons/galera/garsu.jpg";

export default {
	id: "galera",
	title: "Galèra",
  	icon: galeraIcon,
	songs: [
		"Ziggy Dance",
		"Tyla Tranko",
		"Sluškų gatvė",
		"Pleroma",
		"Švelniai plaukia",
		"Umberto",
		"Trilogija: I dalis 'Preliudas'",
		"Trilogija: II dalis 'Fandango'",
		"Trilogija: III dalis 'Badinerie' (Pokštas)",
		"PLAKA",
		"Būsenos",
		"INTERLIUDIJA",
		"Gal Ir Niekada",
		"Mama, bus gerai!",
		"GARSU",
		"Ar dangus vėl žemę atras"
	],
	albums: [
		{
			id: "tyla-tranko",
			name: "Tyla Tranko",
			icon: tylaTrankoIcon,
			songs: [
				"Ziggy Dance",
				"Tyla Tranko",
				"Sluškų gatvė",
				"Pleroma",
				"Švelniai plaukia",
				"Umberto"
			],
		},
		{
			id: "garsu",
			name: "Garsu",
			icon: garsuIcon,
			songs: [
				"Trilogija: I dalis 'Preliudas'",
				"Trilogija: II dalis 'Fandango'",
				"Trilogija: III dalis 'Badinerie' (Pokštas)",
				"PLAKA",
				"Būsenos",
				"INTERLIUDIJA",
				"Gal Ir Niekada",
				"Mama, bus gerai!",
				"GARSU"
			],
		},
	],
};
