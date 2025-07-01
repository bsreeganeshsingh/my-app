import MovieForm from './MovieForm';

const meta = {
  component: MovieForm,
};

export default meta;

export const AddMovieForm = {
  args: {
    initialData: {},
    onSubmit: () => { }
  }
};

export const EditMovieForm = {
  args: {
    initialData: {
      title: 'OG',
      release_date: '2025',
      duration: '2h 48m',
      vote_average: '9.9',
      description: 'Original Gangstar',
      genres: ['ACTION', 'DRAMA', 'ADVENTURE'],
      poster_path: 'https://cdn.123telugu.com/content/wp-content/uploads/2024/02/OG.jpg',
    },
    onSubmit: () => { }
  }
};

export const MissingRequiredFields = {
  args: {
    initialData: {
      title: '',
      release_date: '',
      duration: '',
      rating: '',
      description: '',
      genres: '',
      poster_path: '',
    },
    onSubmit: (data) => console.log('Missing fields submitted:', data),
  }
};
