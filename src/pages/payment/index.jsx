import PaymentInformation from "../../components/payment/PaymentInformation";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const { lecturePackageId } = router.query;

  return (
    <div>
      <h1>결제페이지</h1>
      <PaymentInformation lecturePackageId={lecturePackageId} />
    </div>
  );
};

export default Index;
