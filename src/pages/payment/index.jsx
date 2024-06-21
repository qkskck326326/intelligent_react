import PaymentInformation from "../../components/payment/PaymentInformation";
const Index = () => {
  const lecturePackageId = "6";
  return (
    <div>
      <h1>결제페이지</h1>
      <PaymentInformation packageId={lecturePackageId} />
    </div>
  );
};

export default Index;
