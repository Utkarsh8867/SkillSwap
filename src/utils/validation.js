// Validation rules for forms

export const postValidation = {
  title: {
    required: 'Title is required',
    minLength: { value: 5, message: 'Title must be at least 5 characters' },
    maxLength: { value: 100, message: 'Title must be less than 100 characters' }
  },
  description: {
    required: 'Description is required',
    minLength: { value: 20, message: 'Description must be at least 20 characters' },
    maxLength: { value: 1000, message: 'Description must be less than 1000 characters' }
  },
  category: {
    required: 'Category is required'
  },
  skills: {
    validate: (value) => {
      if (!value || value.length === 0) {
        return 'At least one skill is required';
      }
      if (value.length > 10) {
        return 'Maximum 10 skills allowed';
      }
      return true;
    }
  },
  location: {
    required: 'Location is required'
  },
  availability: {
    required: 'Availability is required'
  },
  duration: {
    required: 'Duration is required'
  }
};

export const authValidation = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: { value: 6, message: 'Password must be at least 6 characters' }
  },
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' }
  }
};