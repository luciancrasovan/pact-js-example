class MovieRepository {

    constructor() {
        this.movies = new Map([]);
    }

    async insert(movie) {
        const id = 100;
        return this.movies.set(id, movie.name, movie.year, movie.genre);
    }
}

module.exports = new MovieRepository();
