class GenreRepository {

    constructor() {
        this.genres = new Map([]);
    }

    async insert(genre) {
        const id = 1000;
        return this.genres.set(id, genre.name);
    }
}

module.exports = new GenreRepository();
