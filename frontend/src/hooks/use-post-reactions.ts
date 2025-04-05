import { toast } from 'sonner';
import { API_URL } from '@/lib/config';

export const usePostReactions = (getToken: () => Promise<string | null>) => {
  const toggleReaction = async (
    postId: string, 
    reactionType: 'like' | 'dislike',
    currentLikes: number,
    currentDislikes: number,
    isLiked: boolean,
    isDisliked: boolean,
    updatePost: (likes: number, dislikes: number, liked: boolean, disliked: boolean) => void
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to react to posts');
        return;
      }

      const endpoint = `${API_URL}/api/social/posts/${postId}/${reactionType}`;
      
      // Optimistically update UI based on current state and action
      let newLikes = currentLikes;
      let newDislikes = currentDislikes;
      let newLiked = isLiked;
      let newDisliked = isDisliked;

      if (reactionType === 'like') {
        if (isLiked) {
          // Unlike
          newLikes--;
          newLiked = false;
        } else {
          // Like
          newLikes++;
          newLiked = true;
          if (isDisliked) {
            newDislikes--;
            newDisliked = false;
          }
        }
      } else {
        if (isDisliked) {
          // Undislike
          newDislikes--;
          newDisliked = false;
        } else {
          // Dislike
          newDislikes++;
          newDisliked = true;
          if (isLiked) {
            newLikes--;
            newLiked = false;
          }
        }
      }

      // Update UI immediately
      updatePost(newLikes, newDislikes, newLiked, newDisliked);

      // Send request to backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        // Revert on failure
        updatePost(currentLikes, currentDislikes, isLiked, isDisliked);
        throw new Error('Failed to update reaction');
      }

    } catch (error) {
      console.error('Error updating reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  return { toggleReaction };
};
