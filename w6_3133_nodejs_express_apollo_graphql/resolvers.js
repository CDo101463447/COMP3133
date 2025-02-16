const Movie = require('./models/Movie');

const resolvers = {
  Query: {
    getAllMovies: async () => await Movie.find(),
    getMovieById: async (_, { id }) => await Movie.findById(id),
  },

  Mutation: {
    addMovie: async (_, { name, director_name, production_house, release_date, rating }) => {
      const newMovie = new Movie({ name, director_name, production_house, release_date, rating });
      return await newMovie.save();
    },
    
    updateMovie: async (_, { id, ...updatedFields }) => {
      return await Movie.findByIdAndUpdate(id, updatedFields, { new: true });
    },

    deleteMovie: async (_, { id }) => {
      await Movie.findByIdAndDelete(id);
      return "Movie deleted successfully.";
    },
  },
};

module.exports = resolvers;
