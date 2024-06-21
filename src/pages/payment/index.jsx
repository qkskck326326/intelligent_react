import PaymentInformation from "../../components/payment/PaymentInformation";
const Index = () => {
  const lecturePackageId = "7";
  return (
    <div>
      <h1>결제페이지</h1>
      <PaymentInformation lecturePackageId={lecturePackageId} />
    </div>
  );
};

export default Index;
