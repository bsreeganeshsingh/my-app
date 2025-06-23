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
      year: '2025',
      duration: '2h 48m',
      rating: '9.9',
      description: 'Original Gangstar',
      genres: ['ACTION', 'DRAMA', 'ADVENTURE'],
      imageUrl: 'https://cdn.123telugu.com/content/wp-content/uploads/2024/02/OG.jpg',
    },
    onSubmit: () => { }
  }
};

export const MissingRequiredFields = {
  args: {
    initialData: {
      title: '',
      year: '',
      duration: '',
      rating: '',
      description: '',
      genres: '',
      imageUrl: '',
    },
    onSubmit: (data) => console.log('Missing fields submitted:', data),
  }
};
