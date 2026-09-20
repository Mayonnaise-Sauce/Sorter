import katarsis from "@/data/katarsis.js";
import akli from "@/data/akli.js";
import galera from "@/data/galera.js";
import mcloud from "@/data/mcloud.js";

// Keeps artists alphabetically ordered everywhere the shared collection is used
export const artists = [
	{
		id: katarsis.id,
		name: katarsis.title,
		icon: katarsis.icon,
		data: katarsis,
	},
	{
		id: akli.id,
		name: akli.title,
		icon: akli.icon,
		data: akli,
	},
	{
		id: galera.id,
		name: galera.title,
		icon: galera.icon,
		data: galera,
	},
	{
		id: mcloud.id,
		name: mcloud.title,
		icon: mcloud.icon,
		data: mcloud,
	},
].sort((first, second) => first.name.localeCompare(second.name, "lt", { sensitivity: "base" }));
