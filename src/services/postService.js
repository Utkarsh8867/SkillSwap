import api from './api';

export const getAllPosts = (params = {}) => {
  return api.get('/posts', { params });
};

export const searchPosts = (searchQuery, page = 1, limit = 10) => {
  return api.get('/posts', {
    params: { search: searchQuery, page, limit }
  });
};

export const getPostById = (postId) => {
  return api.get(`/posts/${postId}`);
};
export const createPost = (postData) => {
  return api.post('/posts', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletePost = (postId) => {
  return api.delete(`/posts/${postId}`);
};

export const updatePost = (postId, postData, removeImages = []) => {
  const formData = new FormData();

  // Add text fields
  Object.keys(postData).forEach(key => {
    if (key !== 'images' && postData[key] !== undefined) {
      if (Array.isArray(postData[key])) {
        formData.append(key, postData[key].join(','));
      } else {
        formData.append(key, postData[key]);
      }
    }
  });

  // Add new images
  if (postData.images) {
    postData.images.forEach(image => {
      formData.append('images', image);
    });
  }

  // Add images to remove
  if (removeImages.length > 0) {
    formData.append('removeImages', JSON.stringify(removeImages));
  }

  return api.put(`/posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const likePost = (postId) => {
  return api.post(`/posts/${postId}/like`);
};

export const bookmarkPost = (postId) => {
  return api.post(`/posts/${postId}/bookmark`);
};

export const unlikePost = (postId) => {
  return api.delete(`/posts/${postId}/like`);
};

export const unbookmarkPost = (postId) => {
  return api.delete(`/posts/${postId}/bookmark`);
};

export const getPostLikes = (postId) => {
  return api.get(`/posts/${postId}/likes`);
};

export const getPostComments = (postId) => {
  return api.get(`/posts/${postId}/comments`);
};

export const createComment = (postId, commentData) => {
  return api.post(`/posts/${postId}/comments`, commentData);
};

export const contactForExchange = (postId, message) => {
  return api.post(`/posts/${postId}/contact`, { message });
};