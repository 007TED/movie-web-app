import {Client, Databases, Query, ID} from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
const database= new Databases(client);


export const updateSearchCount = async (searchTerm, movie) => {
    if (!searchTerm) return;

    // Build poster URL safely
    const posterPath = movie?.poster_path;
    const posterUrl = posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath.startsWith("/") ? "" : "/"}${posterPath}`
        : null;

    const movieId = movie?.id ?? null;

    try {
        // For SQL Tables, this still works: second arg is your tableId
        const result = await database.listDocuments(
            DATABASE_ID,
            TABLE_ID,
            [Query.equal("searchTerm", [searchTerm])]
        );

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            const newCount = Number(doc.count ?? 0) + 1;

            await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count: newCount,
                // Optionally keep latest movie info in sync:
                ...(movieId !== null ? { movie_id: movieId } : {}),
                ...(posterUrl ? { poster_url: posterUrl } : {}),
            });
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movieId,
                poster_url: posterUrl,
            });
        }
    } catch (error) {
        console.error("Failed to update metric:", error);
    }
};
export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            TABLE_ID,

            [Query.limit(5),
            Query.orderDesc("count")
            ]);
        return result.documents;

    }catch (error){
        console.error(error);
    }
}
