// Helper functions for API data formatting and validation

export const formatUserData = (userData) => {
    return {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        skillsToTeach: Array.isArray(userData.skillsToTeach)
            ? userData.skillsToTeach
            : userData.skillsToTeach?.split(',').map(s => s.trim()) || [],
        skillsToLearn: Array.isArray(userData.skillsToLearn)
            ? userData.skillsToLearn
            : userData.skillsToLearn?.split(',').map(s => s.trim()) || [],
        location: {
            city: userData.city || '',
            coordinates: {
                lat: userData.lat || 0,
                lng: userData.lng || 0
            }
        }
    };
};

export const formatPostData = (postData, authorData) => {
    const formData = new FormData();

    // Add text fields
    formData.append('authorId', authorData.userId);
    formData.append('authorName', authorData.name);
    formData.append('authorDP', authorData.profilePicture || '');
    formData.append('title', postData.title);
    formData.append('description', postData.description);

    // Handle skills arrays
    if (postData.skillsOffered) {
        const skills = Array.isArray(postData.skillsOffered)
            ? postData.skillsOffered.join(',')
            : postData.skillsOffered;
        formData.append('skillsOffered', skills);
    }

    if (postData.skillsNeeded) {
        const skills = Array.isArray(postData.skillsNeeded)
            ? postData.skillsNeeded.join(',')
            : postData.skillsNeeded;
        formData.append('skillsNeeded', skills);
    }

    // Add location
    if (postData.location) {
        formData.append('location', JSON.stringify(postData.location));
    }

    // Add images if present
    if (postData.images && postData.images.length > 0) {
        postData.images.forEach((image, index) => {
            formData.append('images', image);
        });
    }

    return formData;
};

export const formatReviewData = (reviewData) => {
    return {
        fromUserId: reviewData.fromUserId,
        toUserId: reviewData.toUserId,
        postId: reviewData.postId,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment,
        skillExchanged: reviewData.skillExchanged
    };
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateCoordinates = (lat, lng) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};