const Like = require("../../models/likeModel");

module.exports = async (data, user_id) => {
  try {
    if (data.length === 0) return data;
    const liked = await Like.find({ user_id: user_id });
    data?.forEach((post) => {
      if (liked.length === 0) post.liked = false;
      post.liked = false;
      liked?.forEach((like) => {
        if (post._id.equals(like.post_id)) return post.liked = true;
        
      });
    });

    return data;
  } catch (error) {
    return [];
  }
};
