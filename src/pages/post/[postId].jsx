import PostDetail from "../../components/post/postDetail";
import { useRouter } from "next/router";
import Footer from "../../components/common/Footer";

const PostDetailPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  console.log("페이지 매개변수:", postId);
  return (
    <div>
      <PostDetail postId={postId} />
      <Footer />
    </div>
  );
};

export default PostDetailPage;
